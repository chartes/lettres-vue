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
    console.log('PersonBlot data : ', data)
    // new Person annotation : data sourced from PersonWizardForm.vue / async savePerson()
    // existing Person annotation : data sourced from formats() below e.g. PersonBlot.formats(this.domNode) using static formats(domNode)
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
    // get both id and href to be able to render the node when editing an existing Person annotation
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
    if (name === 'person' && data) {
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
    console.log("formats :", formats)
    formats['person'] = PersonBlot.formats(this.domNode);
    return formats;
  }
}
PersonBlot.blotName = 'person';
PersonBlot.tagName = 'a';
PersonBlot.className = 'persName';

export default PersonBlot;

