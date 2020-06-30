//import Embed from 'quill/blots/embed';
import Quill from 'quill';

const Embed  = Quill.import('blots/embed')

class LineBreak extends Embed {
  static create(value) {
    let node = super.create(value);
    return node;
  }
  length () {
    return 1
  }
  insertInto(parent, ref) {
    Embed.prototype.insertInto.call(this, parent, ref)
  }
}
LineBreak.blotName = 'linebreak';
LineBreak.tagName = 'br';


export default LineBreak;
