<template>
  <article class="mentions">
    <div class="mentions-content">
      <div class="is-flex layout-main">
        <section class="main container content">
          <!--
          <section class="section" id="mentions-top">
            <h1>Mentions légales</h1>
          </section>
          -->
          <section class="main app-width-margin">
            <div id="article" class="article">
              <h1>Éditeur</h1>
              <p>
                École nationale des chartes, établissement public administratif<br>
                65, rue de Richelieu<br>
                12, rue des Petits-Champs<br>
                75002 Paris<br>
                Tél. + 33 (0)1 55 42 75 00<br>
                Siret : 19753478700043
              </p>
              <hr>
              <h1>Responsable de publication</h1>
              <p>
                Michelle Bubenicek, directrice de l'École nationale des chartes<br>
                secretariat@chartes.psl.eu
              </p>
              <hr>
              <h1>Hébergement</h1>
              <p>
                IR* Huma-Num<br>
                Bâtiment de recherche Nord<br>
                14, cours des humanités<br>
                93322 Aubervilliers cedex
              </p>
              <hr>
              <h1>Données personnelles</h1>
              <p>Consulter la page <a target="_blank" href="https://www.chartes.psl.eu/politique-de-confidentialite">« Politique de confidentialité »</a> de l'École nationale des chartes - PSL.</p>

              <hr>
              <h1>Propriété intellectuelle</h1>

              <h2>Développement et contenus du site</h2>
              <p>Sauf mention contraire, les contenus du site ({{ websiteURL }}) et les données accessibles via ses API sont partagés sous licence ouverte Creative Commons <a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>.
              </p>

              <h2>Crédits photographiques</h2>
              <!--
              <p>Les sources des bannières des pages du site eNDP (endp.chartes.psl.eu) sont les
                suivantes :</p>
              <ul>
                <li>
                  page d'accueil&nbsp;: «&nbsp;Olivier Truschet, Germain Hoyau&nbsp;; Plan de Paris vers 1550&nbsp;», Domaine public, <a href="https://commons.wikimedia.org/wiki/File:Plan_de_Paris_vers_1550_color.jpg">Wikimedia Commons</a>&nbsp;;
                </li>
                <li>
                  page personnes&nbsp;: «&nbsp;Unité de décor - f. 108r, Liturgie&nbsp;: service funèbre&nbsp;», <a href="https://mandragore.bnf.fr/ark:/12148/cgfbt209696b" target="_blank">BnF-Mandragore</a>, <a href="https://gallica.bnf.fr/edit/und/conditions-dutilisation-des-contenus-de-gallica" target="_blank">conditions de réutilisation</a>&nbsp;;
                </li>
                <li>
                  page registres&nbsp;: «&nbsp;Détail du <a href="https://nakala.fr/10.34847/nkl.8bdfe89g" target="_blank">registre capitulaire LL105</a>&nbsp;», <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr" target="_blank">CC-BY 4.0</a>&nbsp;;</li>
                <li>
                  page ressources, mentions légales  et contacts&nbsp;: «&nbsp;Détail de la rosace ouest de la Cathédrale Notre-Dame de Paris&nbsp;», Cyril Preiss, <a href="https://www.culture.gouv.fr/Mentions-legales" target="_blank">conditions de réutilisation</a>.
                </li>
              </ul>

              <p>L'icône <a href="https://icon-icons.com/pack/Business-Solid---The-Capitalism-icon-set/2534" target="_blank">«&nbsp;Processing&nbsp;»</a> présente dans le schéma de la page ressources du site est partagé sous licence <a href="https://creativecommons.org/licenses/by/4.0/legalcode.fr" target="_blank">CC-BY 4.0</a>.</p>

              <p>Les crédits photographiques et autres mentions relatives aux droits d'auteur, tels que spécifiés sur ce site, doivent être respectés.</p>
              -->
              <hr>
              <h1>Responsabilité</h1>
              <p>
                L'éditeur met tout en œuvre pour que les informations disponibles sur le site ({{ websiteURL }})
                soient aussi disponibles, exactes et à jour que possible, et se réserve le droit de modifier et de corriger leur contenu
                à tout moment et sans préavis.<br>
                Cependant, l'éditeur ne peut garantir la disponibilité, l'exactitude ou l'exhaustivité des informations présentées.
                L'utilisation des informations disponibles ou fournies sur ce site web relève de la seule responsabilité de l'utilisateur.<br>
                Les sites web ou les informations de tiers référencés sur le site ont été sélectionnés et fournis aux utilisateurs uniquement à des fins de commodité et d'information.
                L'éditeur ne saurait être tenu responsable de tout dommage, de quelque nature que ce soit, résultant de l'interprétation ou de l'utilisation des informations disponibles sur le site ou sur des sites tiers.
              </p>
              <p>Cette page est susceptible d'être modifiée et mise à jour à tout moment sans préavis.<br>
                <br>
                Dernière mise à jour de la page : {{ lastModified }}.
              </p>
            </div>
          </section>
        </section>
      </div>
    </div>
  </article>
</template>

<script>

import { baseApiURL } from "@/modules/http-common"

export default {
  name: "MentionsLegalesPage",
  components: {
  },
  data () {
    return {
      API_URL: baseApiURL,
      websiteURL: `${process.env.VUE_APP_APP_URL}`,
      lastModified: new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(document.lastModified)).replace(/\./g, '-')
    }
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.mentions-content {
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
article.mentions {
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

@media screen and (max-width: 800px) {
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
}
</style>