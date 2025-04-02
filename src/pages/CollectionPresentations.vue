<template>
  <!-- ### CATHERINE DE MEDICIS ID = 1 ### -->

  <!-- Historique -->
  <div
    v-if="$props.collectionId === 1"
  >
    <div
      class="heading is-uppercase"
      :class="isHistoryOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Historique</span>
      <span
        class="icon"
        :aria-expanded="isHistoryOpen"
        aria-controls="historySection"
        @click="isHistoryOpen = !isHistoryOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isHistoryOpen? '' : 'hiddendiv'"
      aria-id="historySection"
    >
      <div class="collection-section-content">
        <p>Catherine de Médicis (1519-1589) est la fille du duc d’Urbino Laurent de Médicis et de Madeleine de La Tour d’Auvergne. Épouse du duc d’orléans, second fils de François Ier, elle devient reine de France lorsque celui accède au trône de France en 1547. Trois de ses fils se succèdent ensuite comme rois de France, François II (1559-1560), Charles IX (1560-1574) et Henri III (1574-1589). Elle assure la régence du royaume à deux reprises (décembre 1560-août 1563 et février-septembre 1574), mais son influence sur le gouvernement de la France durant plus de trois décennies est très importante, ainsi qu’en témoigne sa correspondance.</p>
        <p>Ses lettres autographes reflètent l’identité de cette femme, italienne et française. Son intense activité épistolaire est toutefois avant tout documentée par les très nombreuses lettres écrites pour elle par ses secrétaires à des destinataires très variés, souverains étrangers, membres de sa famille ou de la cour, mais aussi agents royaux en France et en poste en Europe.</p>
        <p>Gouverner par correspondance fut un moteur et un instrument essentiels de l’action de cette reine, puis reine-mère qui oscilla entre une politique de conciliation entre catholiques et protestants, puis une défense ferme de la monarchie contre tous ceux (réformés ou catholiques radicaux) qui menaçaient l’unité du royaume autour du souverain incarné par ses fils.</p>
      </div>
    </b-collapse>
    <!-- Contributeurs & partenariats -->
    <div
      class="heading is-uppercase"
      :class="isCreditsOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Contributeurs & partenariats</span>
      <span
        class="icon"
        :aria-expanded="isCreditsOpen"
        aria-controls="creditsSection"
        @click="isCreditsOpen = !isCreditsOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isCreditsOpen? '' : 'hiddendiv'"
      aria-id="creditsSection"
    >
      <div class="collection-section-content">
        <p>L’édition publiée au XIXe siècle par le Comité des travaux historiques et scientifiques a été partiellement, revue, associée à des métadonnées et complétée par l’édition de de nouvelles lettres par Aurélie Massie, Olivier Poncet et Julien Wilmart.</p>
      </div>
    </b-collapse>
    <!-- Bibliographie -->
    <div
      class="heading is-uppercase"
      :class="isBiblioOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Bibliographie sélective</span>
      <span
        class="icon"
        :aria-expanded="isBiblioOpen"
        aria-controls="biblioSection"
        @click="isBiblioOpen = !isBiblioOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isBiblioOpen? '' : 'hiddendiv'"
      aria-id="biblioSection"
    >
      <div class="collection-section-content">
        <ul class="mt-2 mb-2">
          <li><em>Lettres de Catherine de Médicis</em>, éd. Hector de La Ferrière-Percy et Gustave Baguenault de Puchesse, 11 volumes, Paris, Imprimerie nationale, 1880-1943 (Documents inédits sur l’histoire de France)</li>
          <li>Matthieu Gellard, <em>Commentaire critique de l’édition des « Lettres de Catherine de Médicis »</em>, Paris, Cour de France.fr, 2013 (<a target="_blank" href="https://cour-de-france.fr/article2788.html">https://cour-de-france.fr/article2788.html</a>)</li>
          <li>Matthieu Gellard, <em>Une reine épistolaire. Lettres et pouvoir au temps de Catherine de Médicis</em>, Paris, Classiques Garnier, 2014 (Bibliothèque d’histoire de la Renaissance, 8).</li>
        </ul>
      </div>
    </b-collapse>
  </div>

  <!-- ### HENRI IV ID = 3 ### -->

  <!-- Historique -->
  <div
    v-else-if="$props.collectionId === 3"
  >
    <div
      class="heading is-uppercase"
      :class="isHistoryOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Historique</span>
      <span
        class="icon"
        :aria-expanded="isHistoryOpen"
        aria-controls="historySection"
        @click="isHistoryOpen = !isHistoryOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isHistoryOpen? '' : 'hiddendiv'"
      aria-id="historySection"
    >
      <div class="collection-section-content">
        <p>Henri de Bourbon (1553-1610) est le fils d’Antoine de Bourbon et de Jeanne d’Albret, roi et reine de Navarre. Chef du parti protestant, après un bref passage à la religion catholique entre 1572 et 1575 à la faveur de son mariage avec Marguerite de Valois, il été l’un des acteurs majeurs des Guerres de Religion qui ont déchiré le royaume de France durant les années 1570-1580. Héritier de la couronne de France en vertu des lois successorales françaises, il succède au roi Henri III assassiné en 1589 et se convertit nouveau au catholicisme en 1593. Le long règne de Henri IV se partage entre une phase de reconquête du royaume, sanctionnés en 1598 par la paix de Vervins avec l’Espagne et l’édit de tolérance de Nantes, et une phase de restauration interrompue par son propre assassinat en 1610.</p>
        <p>Sa correspondance active restitue près d’un demi-siècle d’histoire de France, au plan intérieur comme extérieur, et se signale par une prédilection pour l’écriture de lettres autographes qui restituent le volontarisme et le style direct du premier roi de la dynastie des Bourbon, demeuré dans l’imaginaire collectif comme un souverain ayant refermé provisoirement les guerres civiles et religieuses et posé les bases d’un gouvernement monarchique moderne.</p>
      </div>
    </b-collapse>
    <!-- Contributeurs & partenariats -->
    <div
      class="heading is-uppercase"
      :class="isCreditsOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Contributeurs & partenariats</span>
      <span
        class="icon"
        :aria-expanded="isCreditsOpen"
        aria-controls="creditsSection"
        @click="isCreditsOpen = !isCreditsOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isCreditsOpen? '' : 'hiddendiv'"
      aria-id="creditsSection"
    >
      <div class="collection-section-content">
        <p>L’édition publiée au XIXe siècle par le Comité des travaux historiques et scientifiques a été rétroconvertie avec le soutien de l’université de Besançon (Centre Lucien-Febvre), sous la direction scientifique de Hugues Daussy, professeur d’histoire moderne, qui assure la direction de sa reprise et de son complément scientifiques.</p>
      </div>
    </b-collapse>
    <!-- Bibliographie -->
    <div
      class="heading is-uppercase"
      :class="isBiblioOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Bibliographie sélective</span>
      <span
        class="icon"
        :aria-expanded="isBiblioOpen"
        aria-controls="biblioSection"
        @click="isBiblioOpen = !isBiblioOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isBiblioOpen? '' : 'hiddendiv'"
      aria-id="biblioSection"
    >
      <div class="collection-section-content">
        <ul class="mt-2 mb-2">
          <li><em>Recueil des lettre missives de Henri IV</em>, éd. Jules Berger de Xivrey et Joseph Guadet, 9 volumes, Paris, Imprimerie nationale, 1843-1876 (Documents inédits sur l’histoire de France).</li>
          <li><em>Lettres de Henri IV concernant les relations du Saint-Siège et de la France, 1595-1609</em>, éd. Bernard Barbiche, Cité du Vatican, Biblioteca Apostolica Vaticana, 1968 (Studi e testi, 250).</li>
        </ul>
      </div>
    </b-collapse>
  </div>

  <!-- ### AUTRES COLLECTIONS ### -->


  <div v-else>
    <div
      class="heading is-uppercase"
      :class="isHistoryOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Historique</span>
      <span
        class="icon"
        :aria-expanded="isHistoryOpen"
        aria-controls="historySection"
        @click="isHistoryOpen = !isHistoryOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isHistoryOpen? '' : 'hiddendiv'"
      aria-id="historySection"
    >
      <div class="collection-section-content">
        <p>Non renseigné</p>
      </div>
    </b-collapse>
    <!-- Contributeurs & partenariats -->
    <div
      class="heading is-uppercase"
      :class="isCreditsOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Contributeurs & partenariats</span>
      <span
        class="icon"
        :aria-expanded="isCreditsOpen"
        aria-controls="creditsSection"
        @click="isCreditsOpen = !isCreditsOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isCreditsOpen? '' : 'hiddendiv'"
      aria-id="creditsSection"
    >
      <div class="collection-section-content">
        <p>Non renseigné</p>
      </div>
    </b-collapse>
    <!-- Bibliographie -->
    <div
      class="heading is-uppercase"
      :class="isBiblioOpen ? 'is-closed' : ''"
    >
      <span class="heading-content">Bibliographie sélective</span>
      <span
        class="icon"
        :aria-expanded="isBiblioOpen"
        aria-controls="biblioSection"
        @click="isBiblioOpen = !isBiblioOpen"
      >
      </span>
    </div>
    <b-collapse
      :class="isBiblioOpen? '' : 'hiddendiv'"
      aria-id="biblioSection"
    >
      <div class="collection-section-content">
        <span>Non renseigné</span>
        <!--
        <ul class="mt-2 mb-2">
          <li><em>Lettres de Catherine de Médicis</em>, éd. Hector de La Ferrière-Percy et Gustave Baguenault de Puchesse, 11 volumes, Paris, Imprimerie nationale, 1880-1943 (Documents inédits sur l’histoire de France)</li>
          <li>Matthieu Gellard, <em>Commentaire critique de l’édition des « Lettres de Catherine de Médicis »</em>, Paris, Cour de France.fr, 2013 (<a target="_blank" href="https://cour-de-france.fr/article2788.html">https://cour-de-france.fr/article2788.html</a>)</li>
          <li>Matthieu Gellard, <em>Une reine épistolaire. Lettres et pouvoir au temps de Catherine de Médicis</em>, Paris, Classiques Garnier, 2014 (Bibliothèque d’histoire de la Renaissance, 8).</li>
        </ul>
        -->
      </div>
    </b-collapse>
  </div>

</template>
<script>
export default {
  name: "CollectionPresentation",
  props: {
    collectionId: { type: Number, required: true },
  },
  data() {
    return {
      isHistoryOpen: true,
      isCreditsOpen: true,
      isBiblioOpen: true,
    };
  },
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/elements/_select.scss";

// Sections : Termes et contenus des metadonnées de la collection
.collection-section {

  & > .heading {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-bottom: 20px;

    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    color: #FF0052;
    letter-spacing: 0;
    text-transform: uppercase;

    .heading-content {
      order: 1;
      display: inline-block;
      white-space: pre;
    }

    span.icon {
      display: inline-block;
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: url(../assets/images/icons/open_text.svg) center / 24px auto no-repeat;
      order: 3;

      i {
        display: none;
      }
    }

    &.is-closed span.icon {
      background: url(../assets/images/icons/close_text.svg) center / 18px auto no-repeat;
    }

    &::after {
      order: 2;
      display: block;
      content: '';
      width: 100%;
      border-bottom: 1px solid #FF0052;
    }
  }

  & .collection-section-content {
    padding: 30px 140px 30px 90px;
    font-size: 20px;
    line-height: 26px;

    @include on-tablet {
      padding: 10px 20px;
      font-size: $font-size-text-tablet;
      line-height: 1.25;
    }

    @include on-mobile {
      padding: 0;
      font-size: $font-size-text-mobile;
      line-height: 1.28;
    }

    p {
      margin-bottom: 20px;
    }

    ul li {
      margin-bottom: 8px !important;
    }

    a {
      color: #C00055;

      &:hover {
        text-decoration: underline;
        text-decoration-style: dotted;
        text-underline-offset: 2px;
      }
    }
  }
}
.hiddendiv {
  display: none;
}
</style>