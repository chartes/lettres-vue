<template>
  <article class="documentation">
    <div class="documentation-content">
      <div class="is-flex layout-main">
        <section class="toc" :class="menuCsscClass">
          <ul class="toc-lvl1">
            <li>
              <a href="#json-api">API JSON</a>
              <ul class="toc-lvl2">
                <li><a href="#json-api-pagination">Pagination</a></li>
                <li><a href="#compound-documents">Compound Documents</a></li>
                <li><a href="#sparse-fieldset">Sparse Fieldset</a></li>
                <li><a href="#custom-specs">Implémentations spécifiques</a></li>
              </ul>
            </li>
            <li>
              <a href="#resources">Ressources exposées</a>
              <ul class="toc-lvl2">
                <li><a href="#persons">Personnes</a></li>
                <li><a href="#places">Lieux</a></li>
                <li><a href="#iiif-links">Lien texte/image</a></li>
              </ul>
            </li>
            <li>
              <a href="#search-api">API de recherche</a>
              <ul class="toc-lvl2">
                <li><a href="#search-scope">Périmètre de la recherche</a></li>
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
                  <a href="#search-filters-sort">Filtres et tris</a>
                  <ul class="toc-lvl3">
                    <li><a href="#search-filter-dates">Dates</a></li>
                    <li><a href="#search-filter-places">Lieux</a></li>
                    <li><a href="#search-filter-persons">Personnes</a></li>
                    <li><a href="#search-filter-multiple">Combiner les filtres</a></li>
                    <li><a href="#search-sort">Tris</a></li>
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
          <section class="section" id="documentation-top">
            <h1>Documentation</h1>
            <p>
              Documentation de référence de l’API 1.0 de ecco.chartes.psl.eu.<br>
            </p>
            <p>
              Cette application entend répondre aux exigences éditoriales de l’accès libre
              et aux attentes scientifiques combinées de l’ouverture des données.
            </p>
            <p>
              Cette documentation met l’accent sur les requêtes <code>GET</code> : elle
              est conçue pour guider les chercheurs désireux de récupérer les données
              brutes à des fins d’analyse et les développeurs qui souhaiteraient fournir
              de nouveaux outils ou services.
            </p>
            <p>Pourquoi des API pour le partage de données ?</p>
            <ul>
              <li>
                Rendre les données FAIR (Findable, Accessible, Interoperable and
                Reusable).
              </li>
              <li>
                Favoriser leur republication et améliorer leur citabilité.
              </li>
              <li>
                Accéder aux données brutes et pouvoir les valider : s’affranchir de la
                médiation d’une interface graphique.
              </li>
              <li>
                Constituer librement des corpus sur mesure pour les analyses.
              </li>
              <li>
                Favoriser le développement d'interfaces utilisateur, d'outils et de
                services.
              </li>
              <li>
                Améliorer la pérennité des développements.
              </li>
            </ul>
          </section>
          <section class="section" id="json-api">
            <h2>API JSON</h2>
            <p>
              Les ressources sont renvoyées suivant le standard <a href="https://jsonapi.org/format/" target="_blank">JSON:API 1.0</a>.<br>
              Les fonctionnalités optionnelles de JSON:API 1.0 ne sont pas toutes implémentées.
            </p>
          </section>
          <section class="section" id="json-api-pagination">
            <h3>Pagination</h3>
            <p>
              La recherche ainsi que l’accès aux collections de ressources renvoient des résultats <a href="https://jsonapi.org/format/1.0/#fetching-pagination" target="_blank">paginés</a>.<br>
              L’objet <code>links</code> contient les liens de navigation permettant de se rendre sur les différentes pages du résultat (<code>first</code>, <code>last</code>, <code>prev</code>, <code>next</code>).
            </p>
          </section>
          <section class="section" id="compound-documents">
            <h3>Compound Documents</h3>
            <p>
              <a href="https://jsonapi.org/format/1.0/#document-compound-documents" target="_blank">Compound Documents</a> (documents composites) : le paramètre de requête <a href="https://jsonapi.org/format/#fetching-includes" target="_blank"><code>include</code></a> permet d’inclure dans la réponse des ressources reliées à la source primaire. Les ressources sont incluses dans le tableau de premier niveau <code>included</code>.
            </p>
            <api-call-dropdown
              method="GET"
              description="La lettre 3488 avec la liste des personnes liées à cette lettre "
              :url="`${API_URL}/documents/3488?without-relationships&include=persons`"
            />
          </section>
          <section class="section" id="sparse-fieldset">
            <h3>Sparse fieldset</h3>
            <p>
              L’API de recherche utilise les requêtes de type
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-query-string-query.html#query-string-syntax"
                target="_blank"
                ><code>query_string</code></a
              >.
            </p>
          </section>
          <section class="section" id="custom-specs">
            <h3>Implémentation spécifiques</h3>
            <p>
              L’API de recherche utilise les requêtes de type
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-query-string-query.html#query-string-syntax"
                target="_blank"
                ><code>query_string</code></a
              >.
            </p>
          </section>
          <section class="section" id="resources">
            <h2>Ressources exposées</h2>
            <p>
              L’API de recherche est construite avec
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/index.html"
                target="_blank"
                >Elasticsearch 6.8</a
              >.
            </p>
          </section>
          <section class="section" id="persons">
            <h3>Personnes</h3>
            <p>
              L’API de recherche utilise les requêtes de type
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-query-string-query.html#query-string-syntax"
                target="_blank"
                ><code>query_string</code></a
              >.
            </p>
          </section>
          <section class="section" id="places">
            <h3>Lieux</h3>
            <p>
              L’API de recherche utilise les requêtes de type
              <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/6.8/query-dsl-query-string-query.html#query-string-syntax"
                target="_blank"
                ><code>query_string</code></a
              >.
            </p>
          </section>
          <section class="section" id="iiif-links">
            <h3>IIIF – TODO</h3>
            <p>
              TODO
            </p>
          </section>
          <section class="section" id="search-api">
            <h2>API de recherche</h2>
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
          <section class="section" id="search-scope"></section>
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
          <section class="section" id="search-filters-sort">
            <h3>Filtres et tris</h3>
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
          <section class="section" id="search-filter-dates">
            <h4>Dates</h4>
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
          <section class="section" id="search-filter-places">
            <h4>Lieux</h4>
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
          <section class="section" id="search-filter-persons">
            <h4>Personnes</h4>
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
          <section class="section" id="search-filter-multiple">
            <h4>Combiner les filtres</h4>
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
          <section class="section" id="search-sort">
            <h4>Tris</h4>
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