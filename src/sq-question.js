import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';

export class SQQuestion extends LitElement {
  static get tag() {
    return 'sq-question';
  }

  constructor() {
      super();
  }

  static get properties() {
      return {
          ...super.properties,
      }
  }

  //move up button
  //could have update a property called moveup?
  //changed property calls the function that moves the postion
  //then removes the move up property? and do the same for movedown?
  __moveUp() {
    console.log("up clicked");
    let parent = this.parentNode;
    if(parent.children[0] === this){
      return;
    } else{
      parent.insertBefore(this, this.previousSibling);
    }
  }

  //move down button
  __moveDown() {
    console.log("down clicked");
    let parent = this.parentNode;
    if(parent.children.lastElementChild === this){
      console.log(this.parent);
      return;
    } else{
      parent.insertBefore(this, this.nextSibling.nextSibling);
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 5px 0px 5px 0px;
        }

        .container {
          border: 2px solid black;
          display: flex;
          justify-content: space-between;
          border-radius: 5px;
        }

        .textArea {
          padding: 12px 0 0 10px;
        }

        slot {
          height: 100%;
        }
        

        .buttonArea {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-around;
          align-items: center;
          margin: 5px;
        }

        button {
          height: 100%;
          margin: 2%;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="container">
        <div class="textArea">
          <slot></slot>
        </div>
        <div class="buttonArea">
          <button class="bup" @click="${this.__moveUp}">
            <simple-icon-lite
              icon="hardware:keyboard-arrow-up"
            ></simple-icon-lite>
          </button>
          <button class="bdown" @click="${this.__moveDown}">
            <simple-icon-lite
              icon="hardware:keyboard-arrow-down"
            ></simple-icon-lite>
          </button>
        </div>
      </div>
    `;
  }
}

window.customElements.define(SQQuestion.tag, SQQuestion);
