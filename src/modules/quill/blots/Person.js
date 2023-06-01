/*
 Personne
 Blot : inline
 TEI : persName/@ref
 HTML5 : a[@class="persName"]/@href
*/

import Quill from 'quill';

let Inline = Quill.import('blots/inline');

class PersonBlot extends Inline {

  static create(data) {
    console.log('PersonBlot data : ', data) // data sourced from PersonWizardForm.vue / async savePerson()
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
    if (name === 'person' && data) {
      this.domNode.setAttribute('id', data);
    } else {
      super.format(name, data);
    }
  }

  formats() {
    let formats = super.formats();
    console.log("formats :", formats)
    formats['person'] = PersonBlot.formats(this.domNode);
    return formats;
  }
}
PersonBlot.blotName = 'person';
PersonBlot.tagName = 'a';
PersonBlot.className = 'persName';

export default PersonBlot;

