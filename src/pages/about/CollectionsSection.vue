<template>
  <article>
    <!--<h1 class="mt-5 mb-5">
      <span class="display-1">Les collections</span>
    </h1>-->
    <h2 class="subtitle">Les collections</h2>
    <section>
      <p class="has-text-justified mb-2">
        Une collection est un ensemble de lettres réunies selon une logique propre. Les différentes collections sont organisées librement, soit autour de la correspondance écrite par une personne physique ou morale (ville par exemple), soit de la correspondance écrite et reçue par cette même personne, soit encore d’un groupe de personnes unies par une même thématique (métier, lieu de vie, participation à un événement etc.). Le nombre importe peu : une collection peut être faite de milliers de lettres, comme de quelques-unes, voire d’une seule. Cette conception souple de la notion de collection permet de mettre en avant des auteurs et des lettres qui sont moins volontiers pris en compte par les éditeurs.
      </p>
      <p class="has-text-justified mb-2">
        Chaque collection est placée sous la responsabilité d’un ou de plusieurs responsables scientifiques qui définissent la visée de leur entreprise éditoriale et le champ de leurs investigations. Chaque lettre constitue un item avec sa référence propre et peut ainsi apparaître dans différentes collections dans l’hypothèse où l’expéditeur et le destinataire font chacun l’objet d’une collection.
      </p>
      <b-button
        tag="router-link"
        to="/collections"
        type="is-primary">
        Découvrir les collections
      </b-button>
    </section>
  </article>
</template>

<script>
export default {
  name: 'project'
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>