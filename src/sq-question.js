import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';

export class SQQuestion extends LitElement {
  static get tag() {
    return 'sq-question';
  }

  constructor() {
    super();
    this.backgroundColor = "";
    this.correct = false;
    this.moved = false;
    this.upDisabled = false;
    this.downDisabled = false;
  }

  static get properties() {
      return {
        ...super.properties,
        checkColor: { type: String }, 
        correct: { type: Boolean, reflect: true },
        // moved: { type: Boolean },
        upDisabled: { type: Boolean },
        downDisabled: { type: Boolean },
      }
  }

  //move up button
  __moveUp() {
    //enables down button incase already disbaled from being top question
    // this.downDisabled = false;

    let parent = this.parentNode;
    if(parent.children[0] === this){
      // this.upDisabled = true;
      return;
    } else{
      parent.insertBefore(this, this.previousElementSibling);
    }
    // this.moved = true;
    //setTimeout(() => {this.moved = false}, 5000);
    // this.moved = false;
  }

  //move down button
  __moveDown() {
    //enables up button incase already disbaled from being bottom question
    // this.upDisabled = false;

    let parent = this.parentNode;
    if(parent.lastElementChild === this){
      // this.downDisabled = true;
      return;
    } else{
      parent.insertBefore(this, this.nextElementSibling.nextElementSibling);
    }
    // this.moved = true;
    //setTimeout(() => {this.moved = false}, 20000);
    // this.moved = false;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 5px 0px 5px 0px;
        }

        :host([correct=true]) {
          background-color: lightgreen;
        }

        :host([correct=false]) {
          background-color: salmon;
        }

        :host([!correct]) {
          background-color: white;
        }

        .container {
          border: 2px solid black;
          display: flex;
          justify-content: space-between;
          border-radius: 5px;
        }

        /* .container([moved=true]) {
          animation-name: barSwitch;
          animation-duration: 2s;
        } */

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

        /* @keyframes barSwitch {
          0% {background-color:blue;}
          33% {height:calc(100% + 20px); background-color:blue;}
          66% {height:calc(100% + 10px); background-color:blue;}
          100% {height:100%;}
        } */
      `,
    ];
  }

  render() {
    return html`
      <div class="container" draggable="true">
        <div class="textArea">
          <slot></slot>
        </div>
        <div class="buttonArea">
          <button class="bup" ?disabled="${this.upDisabled}" @click="${this.__moveUp}">
            <simple-icon-lite
              icon="hardware:keyboard-arrow-up"
            ></simple-icon-lite>
          </button>
          <button class="bdown" ?disabled="${this.downDisabled}" @click="${this.__moveDown}">
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
