/*
 Lieu
 Blot : inline
 TEI : placeName/@ref
 HTML5 : a[@class="placeName"]/@id
 Utilisation : transcription, traduction, commentaire
*/

import Quill from 'quill';

let Inline = Quill.import('blots/inline');

class LocationBlot extends Inline {

  static create(data) {
    console.log('LocationBlot data : ', data)
    // new Place annotation : data sourced from PlaceWizardForm.vue / async savePlace()
    // existing Place annotation : data sourced from formats() below e.g. LocationBlot.formats(this.domNode) using static formats(domNode)
    let node = super.create();
    if (data.ref) {
      node.setAttribute('target', '_blank');
      node.setAttribute('href', data.ref);
    }
    if (data.label) {
      node.setAttribute('title', data.label);
    }
    node.setAttribute('id', data.id);
    return node;
  }

  static formats(domNode) {
    // get both id and href to be able to render the node when editing an existing Place annotation
    let ref = {};
    if (domNode.hasAttribute('href')) {
      ref = {id: domNode.getAttribute('id'), ref: domNode.getAttribute('href')};
    } else {
      ref = {id: domNode.getAttribute('id')};
    }
    if (domNode.hasAttribute('title')) {
      ref.label = domNode.getAttribute('title')
    }

    return ref || true;
  }

  format(name, data) {
    if (name === 'location' && data) {
      if (data.ref) {
        this.domNode.setAttribute('target', '_blank');
        this.domNode.setAttribute('href', data.ref);
      }
      if (data.label) {
        this.domNode.setAttribute('title', data.label);
      }
      this.domNode.setAttribute('id', data.id);
    } else {
      super.format(name, data);
    }
  }

  formats() {
    let formats = super.formats();
    formats['location'] = LocationBlot.formats(this.domNode);
    return formats;
  }
}
LocationBlot.blotName = 'location';
LocationBlot.tagName = 'a';
LocationBlot.className = 'placeName';

export default LocationBlot;

