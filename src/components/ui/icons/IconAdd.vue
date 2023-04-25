<template>
  <span>
    <svg
    class="icon icon__add"
    viewBox="0 0 20 20"
  >
    <g>
      <circle
        cx="10"
        cy="10"
        r="10"
        fill="#6D7278"
      />
      <line
        class="icon__line"
        x1="10"
        y1="5"
        x2="10"
        y2="15"
        stroke="#FFFFFF"
        stroke-width="2"
      />
      <line
        class="icon__line"
        x1="15"
        y1="10"
        x2="5"
        y2="10"
        stroke="#FFFFFF"
        stroke-width="2"
      />
    </g>
  </svg>
  </span>
</template>

<script>
  export default {
    name: 'IconAdd',
  }
</script>

<style scoped  lang="scss">

span {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url(../../../assets/images/icons/bouton_rond_gris_ajouter.svg) center / 18px auto no-repeat;

  svg {
    display: none;
  }
}

</style>


