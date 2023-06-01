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
    console.log('LocationBlot data : ', data) // data sourced from PlaceWizardForm.vue / async savePlace()
    let node = super.create();
    node.setAttribute('id', data.id);
    node.setAttribute('target', '_blank')
    node.setAttribute('href', data.ref);
    return node;
  }

  static formats(domNode) {
    let ref = domNode.getAttribute('id');
    return ref || true;
  }



  format(name, data) {
    if (name === 'location' && data) {
      this.domNode.setAttribute('id', data);
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

