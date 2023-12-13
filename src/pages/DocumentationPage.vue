<template>
  <article class="documentation">
    <div class="documentation-content">
      <div class="is-flex layout-main">
        <section class="toc" :class="menuCsscClass">
            <ul class="toc-lvl1">
              <li><a href="#ids-pattern">Structure éditoriale</a></li>
              <li>
                <a href="#dts-api">API Texte (DTS)</a>
                <ul class="toc-lvl2">
                  <li><a href="#dts-collections">Collections</a></li>
                  <li><a href="#dts-document">dts-document</a></li>
                </ul>
              </li>
              <li>
                <a href="#iiif-api">API Image (IIIF)</a>
                <ul class="toc-lvl2">
                  <li><a href="#iiif-presentation">Métadonnées</a></li>
                  <li><a href="#iiif-image">Images</a></li>
                  <li><a href="#dts-iiif-links">Lien texte/image</a></li>
                </ul>
              </li>
              <li>
                <a href="#search-api">API de recherche (Elastic)</a>
                <ul class="toc-lvl2">
                  <li>
                    <a href="#search-syntax">Syntaxe des requêtes</a>
                    <ul class="toc-lvl3">
                      <li><a href="#search-pagination">Pagination</a></li>
                      <li><a href="#search-wildcards">Wildcard query</a></li>
                      <li><a href="#search-regex">Regex</a></li>
                      <li><a href="#search-fuzzy">Recherche floue</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="#search-response">Format de réponse</a>
                  </li>
                  <li>
                    <a href="#search-modes">Catalogue et concordances</a>
                    <ul class="toc-lvl3">
                      <li><a href="#search-filters-sort">Filtres et tris</a></li>
                      <li><a href="#search-catalogue">Catalogue</a></li>
                      <li><a href="#search-full-text">Concordances</a></li>
                      <li><a href="#search-both-modes">Concordances filtrées</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </section>
        <a href="#" @click="toggleMenu($event)" class="toggle-menu-btn">
          <i class="fas fa-bars"/>
        </a>
        <section class="main container content">
          <section class="section" id="search-api">
            <h2>Service de recherche</h2>
            <p>
              L’API de recherche est construite avec
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/index.html"
                target="_blank"
                >Elasticsearch 6.8</a
              >.
            </p>
            <p>La recherche peut porter sur :</p>
            <ul>
              <li>
                les seules notices (catalogue) :
                <code>search?query=metadata.{field_name}:{search_string}</code>
              </li>
              <li>
                le corps du texte des positions (concordances) :
                <code>search?query={search_string}</code>
              </li>
            </ul>
            <p>
              L’objectif est de combiner les possibilités d’une recherche catalographique
              (retrouver un document) à celles de la recherche plein texte utiles au
              chercheur, à l’historiographe notamment.
            </p>
          </section>
          <section class="section" id="search-syntax">
            <h3>Syntaxe des requêtes</h3>
            <p>
              L’API de recherche utilise les requêtes de type
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-query-string-query.html#query-string-syntax"
                target="_blank"
                ><code>query_string</code></a
              >.
            </p>
            <p>
              NB. La recherche est insensible à la casse et aux accents (diacritiques).
            </p>
          </section>
          <section class="section" id="search-pagination">
            <h4>Pagination et nombre de résultats</h4>
            <p>Pagination : les résultats sont paginés.</p>
            <p>
              Le paramètre <code>page[size]</code> permet de définir le nombre de
              résultats par page, c’est-à-dire le nombre de notices retournées qui
              correspondent à la requête. Le paramètre <code>page[number]</code> permet
              d’accéder à une page spécifique du résultat. Le champ
              <code>total-count</code> de la réponse indique le nombre de notices total
              correspondant à la requête, indépendemment de la pagination.
            </p>
            <api-call-dropdown
              method="GET"
              description="La 1ère page de 2 résultats des positions dont le texte contient au moins une occurrence de 'cartulaire'"
              :url="`${API_URL}/search?query=cartulaire&page[size]=2`"
            />
            <api-call-dropdown
              method="GET"
              description="La 10e page de 2 résultats des positions dont le texte contient au moins une occurrence de 'cartulaire'"
              :url="`${API_URL}/search?query=cartulaire&page[size]=2&page[number]=10`"
            />
          </section>
          <section class="section" id="search-wildcards">
            <h4>Jokers (<em>Wildcard query</em>)</h4>
            <p>
              Dans une requête, les caractères joker (<em>wildcard operators</em>)
              représentent un ou plusieurs caractères :
            </p>
            <ul>
              <li><code>?</code> : un caractère indéfini</li>
              <li><code>*</code> : représente zéro à plusieurs caractères indéfinis</li>
            </ul>
            <api-call-dropdown
              method="GET"
              description="Wildcard operators, recherche 'gal*re?'"
              :url="`${API_URL}/search?query=gal*re?&searchtype=fulltext&without-relationships`"
            />
          </section>
          <section class="section" id="search-regex">
            <h4>Expressions régulières</h4>
            <p>
              Dans une requête, une
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-regexp-query.html#regexp-syntax"
                target="_blank"
                >expression régulière</a
              >
              peut être intégrée entre 2 barres obliques (<code>/</code>).
            </p>
            <api-call-dropdown
              method="GET"
              description="'charte' (singulier/pluriel) et 'Chartres'…"
              :url="`${API_URL}/search?query=/chartr?es?/&page[size]=3&page[number]=2`"
            />
          </section>
          <section class="section" id="search-fuzzy">
            <h4>Recherche floue</h4>
            <p>
              Pour la
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/common-options.html#fuzziness"
                target="_blank"
                >recherche floue</a
              >, il est possile de passer en suffixe de la chaîne de caractère recherchée
              un paramètre (<em>fuzziness parameter</em>) définissant la
              <a
                href="https://fr.wikipedia.org/wiki/Distance_de_Levenshtein"
                target="_blank"
                >distance d'édition Levenshtein</a
              >
              maximale autorisée (ou le nombre d'éditions) : <code>~0</code> (recherche
              exacte), <code>~1</code> (recherche floue), <code>~2</code> (recherche très
              floue).
            </p>
            <api-call-dropdown
              method="GET"
              description="La recherche floue sur 'Clacy' retourne par exemple 'Flacy' ou 'Clécy'"
              :url="`${API_URL}/search?query=clacy~1`"
            />
          </section>
          <section class="section" id="search-response">
            <h3>Format de réponse</h3>
            <p>
              La réponse est le tableau des notices des positions. Pour chaque notice, les
              champs disponibles sont :
            </p>
            <ul>
              <li><code>title_rich</code> : le titre de la position</li>
              <li><code>author_firstname</code> : le prénom de l’auteur</li>
              <li><code>author_name</code> : le nom de l’auteur</li>
              <li>
                <code>author_gender</code> : genre de l’auteur (<code>1</code>: homme ou
                <code>2</code>: femme)
              </li>
              <li>
                <code>enc_teacher</code> : <code>1</code> si l’auteur est enseignant à
                l’ENC, sinon <code>null</code>
              </li>
              <li><code>promotion_year</code> : l’année de publication</li>
              <li>
                <code>topic_notBefore</code> : borne chronologique de début du sujet
              </li>
              <li><code>topic_notAfter</code> : borne chronologique de fin du sujet</li>
            </ul>
            <p><code>dts_url</code> : permet d’accéder à la position.</p>
          </section>
          <section class="section" id="search-modes">
            <h3>Catalogue et concordances</h3>
          </section>
          <section class="section" id="search-filters-sort">
            <h4>Filtres et tris</h4>
            <p>
              Les champs de la notice sont tous disponibles comme
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-query-string-query.html?baymax=rec&rogue=pop-1&elektra=docs#_field_names"
                target="_blank"
                >champ de la requête</a
              >.
            </p>
            <pre>/search?query=metadata.{field_name}:{search_string}</pre>
            <p>
              Par défaut, les résultats sont triés selon le score de pertinence calculé
              par Elastic Search. Le paramètre de requête <code>sort</code> permet de
              trier les résultats selon un champ choisi. Le préfixe optionnel
              <code>-</code> du nom du champ spécifie l’odre décroissant : par ex.
              <code>&sort=-metadata.promotion_year</code> pour un tri décroissant par date
              de publication.
            </p>
          </section>
          <section class="section" id="search-catalogue">
            <h4>Catalogue</h4>
            <p>La recherche sur le catalogue repose sur l’utilisation de ces champs.</p>
            <api-call-dropdown
              method="GET"
              description="Les positions dont l’auteur porte le nom 'Pastoureau'"
              :url="`${API_URL}/search?query=metadata.author_name:Pastoureau`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions dont l’auteur porte le prénom 'Michelle'"
              :url="`${API_URL}/search?query=metadata.author_firstname:Michelle`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions dont le titre contient le mot 'bestiaire'"
              :url="`${API_URL}/search?query=metadata.title_rich:bestiaire`"
            />
            <api-call-dropdown
              method="GET"
              description="Les 5 dernières positions (ordre antéchronologique de publication) dont le titre contient 'cartulaire'"
              :url="`${API_URL}/search?query=metadata.title_rich:cartulaire&sort=-metadata.promotion_year&page[size]=5`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions rédigées par de futurs enseignants de l’École"
              :url="`${API_URL}/search?query=metadata.enc_teacher:1`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions publiées avant 1851"
              :url="`${API_URL}/search?query=metadata.promotion_year:<1851`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions dont le sujet se déroule après 1968"
              :url="`${API_URL}/search?query=metadata.topic_notBefore:>1968`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions publiées en 1850 et en 1851"
              :url="`${API_URL}/search?query=metadata.promotion_year:(1850 OR 1851)`"
            />
            <p>
              NB. Les bornes chronologiques du sujet ne sont pas toujours renseignées et
              sont parfois fautives.
            </p>
            <p>Il est possible de combiner la recherche sur différents champs.</p>
            <api-call-dropdown
              method="GET"
              description="Les positions dont le sujet se déroule entre 1939 et 1945"
              :url="`${API_URL}/search?query=metadata.topic_notBefore:>=1939 AND metadata.topic_notAfter:<=1945`"
            />
            <p>
              Pour filtrer une requête par intervalle chronologique (bornes chronologiques
              sujet ou période de soutenance), il est aussi possible d’utiliser une
              requête de type
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-range-query.html"
                target="_blank"
                ><code>range</code></a
              >.
            </p>
            <p>Pour définir l’intervalle, on utilise :</p>
            <ul>
              <li><code>gt</code> : plus grand que</li>
              <li><code>gte</code> : plus grand ou égal</li>
              <li><code>lt</code> : plus petit</li>
              <li><code>lte</code> : plus petit ou égal</li>
            </ul>
            <api-call-dropdown
              method="GET"
              description="Recherche sur les titres relatifs à la musique, pendant la période baroque"
              :url="`${API_URL}/search?query=metadata.title_rich:musi*&range[metadata.topic_notBefore]=gte:1600&range[metadata.topic_notAfter]=lte:1750`"
            />
          </section>
          <section class="section" id="search-full-text">
            <h4>Concordances</h4>
            <p>
              Il est possible de lister toutes les occurrences d’un motif dans le corps de
              texte des positions.
            </p>
            <pre>/search?query={search_string}</pre>
            <p>
              Dans la réponse, <code>highlight</code> liste alors les 100 premières
              concordances pour le motif recherché.
            </p>
            <api-call-dropdown
              method="GET"
              description="Les positions contenant le mot 'bestaire'"
              :url="`${API_URL}/search?query=bestiaire`"
            />
            <p>Les requêtes de type <code>range</code> sont également possibles :</p>
            <api-call-dropdown
              method="GET"
              description="Recherche plein texte relative à la musique, pendant la période baroque"
              :url="`${API_URL}/search?query=musi*&range[metadata.topic_notBefore]=gte:1600&range[metadata.topic_notAfter]=lte:1750`"
            />
            <api-call-dropdown
              method="GET"
              description="Recherche plein texte relative à la musique, pendant la période baroque, pour les positions rédigées à partir de 2000"
              :url="`${API_URL}/search?query=musi*&range[metadata.topic_notBefore]=gte:1600&range[metadata.topic_notAfter]=lte:1750&range[metadata.promotion_year]=gte:2000`"
            />
          </section>
          <section class="section" id="search-both-modes">
            <h4>Filtrer les concordances par notice</h4>
            <p>
              Il est possible de combiner recherche plein texte et recherche
              catalographique. Cela revient à filtrer le recherche plein texte grâce aux
              champs des notices.
            </p>
            <pre>
/search?query={search_string} AND metadata.{field_name}:{search_string}</pre
            >
            <api-call-dropdown
              method="GET"
              description="La position contenant le mot 'bestiaire' publiée en 1972…"
              :url="`${API_URL}/search?query=bestiaire AND metadata.promotion_year:1972`"
            />
            <api-call-dropdown
              method="GET"
              description="Les positions contenant le mot 'football' rédigées par une femme"
              :url="`${API_URL}/search?query=football AND metadata.author_gender:2`"
            />
            <api-call-dropdown
              method="GET"
              description="Recherche des occurrences 'Pastoureau' uniquement dans le corps du texte (d’un autre auteur)"
              :url="`${API_URL}/search?query=Pastoureau AND _exists_:metadata.author_name AND metadata.author_name:(NOT Pastoureau)`"
            />
            <p>
              Dans cette requête <code>_exists_</code> permet d’exclure du résultat les
              documents qui n‘ont pas d’auteur (le paratexte introductif et conclusif) ;
              le filtre <code>metadata.author_name:(NOT Pastoureau)</code> exclut du
              résultat les positions rédigées par les auteurs nommés Pastoureau. On liste
              ainsi les seules occurrences de 'Pastoureau' citées par d’autres auteurs.
            </p>
          </section>
        </section>
      </div>
    </div>
  </article>
</template>

<script>

import { mapState, mapActions } from "vuex";
import ApiCallDropdown from "@/components/ApiCallDropdown.vue";
import { baseApiURL } from "@/modules/http-common"

export default {
  name: "DocumentationPage",
  components: { ApiCallDropdown
  },
  data () {
    return {
      isMenuOpened: false,
      API_URL: baseApiURL,
      IIIF_SERVER_URL: `${process.env.VUE_APP_IIIF_SERVER_URL}`,
      IIIF_URL: `${process.env.VUE_APP_IIIF_URL}`,
      IIIF_IMAGES_URL: `${process.env.VUE_APP_IIIF_IMAGES_URL}`,
    }
  },
  computed: {
  menuCsscClass() {
      return this.isMenuOpened ? "opened" : "";
    },
  },
  methods: {
    toggleMenu ($event) {
      $event.preventDefault()
      $event.stopImmediatePropagation()
      this.isMenuOpened = !this.isMenuOpened
    },
    closeMenu () {
      this.isMenuOpened = false
    }
  },
  mounted () {
    document.body.addEventListener('click', this.closeMenu)
  },

}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.documentation-content {
  padding: 0 40px;
}
.main {
  font-family: "Barlow", sans-serif !important;
  font-size: 18px;
  text-align: left;
  font-weight: 400;
  line-height: 28px;
  color: #5f5f5f;

  grid-area: "sidebar";
  padding-bottom: 150px;
}
.main p {
  text-indent: 0;
  padding: 10px 0;
}
.main h1,
.main h2,
.main h3,
.main h4,
.main h5 {
  font-family: "Noto Serif", serif;
  font-style: normal;
  font-weight: 400;
}
.main h1,
.main h2 {
  margin: 60px 0 !important;
  padding-top: 0;
}
.main h1 {
  font-size: 35px;
  line-height: 47px;
}
.main h2 {
  font-size: 25px;
  line-height: 34px;
}
article.documentation {
  margin-top: 0;
}
.content {
  width: calc(100% - 300px);
  //margin-left: 300px; when used with fixed toc
}
.content p,
.content ul {
  font-family: "Barlow", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 32px;
  color: #5f5f5f;
}
.content ul {
  padding-bottom: 10px;
  margin-left: 0;
  list-style-position: inside;
}
.content ul > li {
  margin-bottom: 0;
}
.content h1,
.content h2 {
  padding-top: 0;
}
.content h1 {
  margin: 30px 0 !important;
  font-family: "Noto Serif", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 30px;
  line-height: 42px;
}
.content h2 {
  margin: 70px 0 30px !important;
  font-family: "Barlow", sans-serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 34px;
  color: #b9192f;
}
.toc {
  flex: 300px 0 0;
  //position: fixed;
  //top: 350px;
  grid-area: "main";
  background-color: #ffffff;
  padding: 60px 5px 60px 5px;
  font-family: "Barlow Semi Condensed", sans-serif;
  font-size: 16px;
  text-transform: uppercase;
  overflow: clip;
}
.toc > ul {
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #b9192f;
  border-style: dotted;
}
.toc > ul > li {
  margin: 20px 0;
}
.toc > ul > li > a {
  font-weight: bold;
}
.toc a {
  color: #444;
}
.toc a:hover {
  color: #e63946;
}
.toc-lvl2 {
  padding-left: 0;
  margin-top: -5px;
}
.toc-lvl2 li {
  margin: 10px 0;
}
.toc-lvl3 {
  margin-left: 20px;
}
.divider {
  height: 1px;
  background-color: #cecece;
  margin: 32px 20px;
  min-width: 100%;
}
.section {
  padding-top: 0px;
  padding-bottom: 40px;
}
.api-calls {
  margin-top: 20px;
  margin-bottom: 30px;
}
.toggle-menu-btn {
  //font-family: "Barlow Semi Condensed", sans-serif;
  //font-size: 0;
  font-weight: 500;
  color: #b9192f;
  text-transform: uppercase;

  display: none;
  padding: 0 5px;
  //background: url(../assets/images/icons/open_menu_coll.svg) center / contain no-repeat;
}
/*.toggle-menu-btn {
  display: none !important;

  @include on-mobile {
    display: flex !important;
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:before {
      background-color: currentColor;
      border-radius: inherit;
      bottom: 0;
      color: inherit;
      content: "";
      left: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      transition: opacity .2s cubic-bezier(.4,0,.6,1);
    }

    &:hover {
      &:before {
        opacity: .08;
      }
    }
  }
}
::v-deep section.toc {
  position: fixed;
  //height: 100%;
  max-width: 40vw !important;
  min-width: min-content;
  width: 240px !important;
  z-index: -1;

  @include on-small-tablet {
    ul {
      margin-left: 0;
    }
  }

  @include on-mobile {
    //position: sticky;
    height: 100%;
    left: 0;
    //top: 0;
    padding-top: 50px;
    transition: .3s cubic-bezier(.25,.8,.5,1);
    transform: translateX(-110%);
    border-right: 1px solid #ccc;
    background-color: #fff;
    z-index: -1;
  }
}

div.toc-parent.opened {
  ::v-deep section.toc {
    transform: translateX(0);
  }
}*/
@media screen and (max-width: 800px) {
  .toggle-menu-btn {
    display: block;
    width: 20px;
    height: 30px;
    position: fixed;
    z-index: 10000;
    left: 10px;
    //top: 250px;
  }
  .toc {
    position: fixed;
    left: 0;
    //top: 0;
    z-index: 2;
    padding-left: 60px;
    padding-right: 30px;
    padding-top: 120px;
    background-color: rgba(255, 255, 255, 0.95);
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    transform: translateX(-110%);
    height: 100vh;
    overflow: auto;
  }
  .toc.opened {
    transform: translateX(0%);
    border-right: 1px solid #ccc;
  }
  .toc > ul {
    border: none !important;
  }
  .divider {
    width: calc(100vw - 100px);
    min-width: unset;
  }
  .content {
    width: 100%;
    padding: 0 0 50px;
    z-index: 1;
  }
  .content .section {
    padding-top: 0;
    padding-bottom: 10px;
  }
  .content p,
  .content ul {
    font-size: 16px;
    line-height: 24px;
  }
  .content p {
    margin: 0 !important;
  }
  .content ul {
    list-style-position: outside;
    margin: 20px 0 20px 10px !important;
  }
  .content h1,
  .content h2 {
    text-align: left;
    width: 80%;
  }
  .content h1 {
    font-size: 30px;
    line-height: 36px;
    margin: 35px 0 !important;
  }
  .content h2,
  .content h3,
  .content h4 {
    margin: 10px 0 !important;
  }
  .content h2 {
    font-size: 20px;
    line-height: 26px;
  }
  .content h3 {
    font-size: 18px;
    line-height: 24px;
  }
  ::v-deep .method {
    width: 45px;
    font-size: 10px !important;
    margin-right: 10px !important;
    padding: 0 !important;
  }
  ::v-deep .grid-container {
    grid-template-columns: 70px auto 35px;
    font-size: 12px;
    line-height: 21px;
  }
}
@media screen and (max-width: 500px) {
  .toggle-menu-btn {
  }
}
</style>