<template>
  <div
    class="control"
  >
    <button
      class="button is-small"
      :class="buttonClass"
      :disabled="!active"
      @click="callback(format)"
    />
  </div>
</template>

<script>
import icons from "../../../modules/quill/icons";

export default {
  name: "EditorButton",
  props: {
    selected: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    callback: { type: Function, default: () => {} },
    format: { type: String, default: "" },
  },
  computed: {
    buttonClass() {
      return this.format + "-btn " + ( this.selected ? "selected" : "" );
    },
    iconClass() {
      return "fa fa-" + this.icon;
    },
    iconSvg() {
      return icons[this.format];
    },
  },
};
</script>

<style scoped  lang="scss">
.control {

  button {
    display: inline-block;
    width: 47px;
    height: 47px;
    background-color: #F2F2F2;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 4px !important;
    border: none;

    &:hover {
      background-color: #E9E9E9;
    }

    &.selected {
      background-color: #FFE76E;
    }

    &.italic-btn {
      background-image: url(../../../assets/images/icons/editor_ital.svg);
      background-size: 10px auto;
    }

    /* Manquent les icônes */

    &.bold-btn {
      background-image: url(../../../assets/images/icons/editor_bold.svg);
    }

    &.underline-btn {
      background-image: url(../../../assets/images/icons/editor_underline.svg);
    }

    &.del-btn {
      background-image: url(../../../assets/images/icons/editor_del.svg);
    }

    &.cite-btn {
      background-image: url(../../../assets/images/icons/editor_quote.svg);
    }

    /* */

    &.superscript-btn {
      background-image: url(../../../assets/images/icons/editor_exposant.svg);
      background-size: 20px auto;
    }

    &.page-btn {
      background-image: url(../../../assets/images/icons/editor_saut_page.svg);
      background-size: 22px auto;
    }

    &.person-btn {
      background-image: url(../../../assets/images/icons/editor_perso.svg);
      background-size: 20px auto;
    }

    &.location-btn {
      background-image: url(../../../assets/images/icons/editor_lieu.svg);
      background-size: 20px auto;
    }

    &.note-btn {
      background-image: url(../../../assets/images/icons/editor_ajout_note.svg);
      background-size: 28px auto;
    }

    &.link-btn {
      background-image: url(../../../assets/images/icons/editor_lien.svg);
      background-size: 25px auto;
    }

    &.list-btn {
      background-image: url(../../../assets/images/icons/editor_liste.svg);
      background-size: 25px auto;
    }

    & > * {
      display: none !important;
    }
  }
}
</style>
