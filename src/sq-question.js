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
    this.movedUp = false;
    this.movedDown = false;
    this.upDisabled = false;
    this.downDisabled = false;
    this.nodePlaceHolderOnUp;
    this.nodePlaceHolderOnDown;
  }

  static get properties() {
      return {
        ...super.properties,
        checkColor: { type: String }, 
        correct: { type: Boolean, reflect: true },
        movedUp: { type: Boolean },
        movedDown: { type: Boolean },
        upDisabled: { type: Boolean },
        downDisabled: { type: Boolean },
      }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {

      //sets or removes disabled buttons based on postion when up button clicked
      if (propName === "movedUp") {
        if(this.movedUp){
          //if question is moved up from last position
          if(this === this.parentNode.children[this.parentNode.children.length - 2]){
            this.downDisabled = false;
            this.nodePlaceHolderOnUp.downDisabled = true;
          }
          //if question is moved up from second position
          if(this === this.parentNode.children[0]){
            this.upDisabled = true;
            this.nodePlaceHolderOnUp.upDisabled = false;
          }
          this.movedUp = false;
        }
      }

      //removes and sets disabled for swapped first questions' up buttons
      if (propName === "movedDown") {
        if(this.movedDown){
          //if question is moved down from first position
          if(this === this.parentNode.children[1]){
            this.upDisabled = false;
            this.nodePlaceHolderOnDown.upDisabled = true;
          }
          //if question is moved down from second to last position
          if(this === this.parentNode.children[this.parentNode.children.length - 1]){
            this.downDisabled = true;
            this.nodePlaceHolderOnDown.downDisabled = false
          }
          this.movedDown = false;
        }
      }

      //when get out of checked state, top and bottom question buttons stay disabled
      //correct is triggered but checked state on SortingQuestion.js
      if (propName === "correct") {
        if(!this.correct) {
          //disables up button on first question from the start
          if (this === this.parentNode.children[0]){
            this.upDisabled = true;
          }

          if (this === this.parentNode.lastElementChild){
            this.downDisabled = true;
          }
        }
      }
    });
  }

  // Lit life-cycle; this fires the 1st time the element is rendered on the screen
  // this is a sign it is safe to make calls to this.shadowRoot
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    //disables up button on first question from the start
    if (this === this.parentNode.children[0]){
      this.upDisabled = true;
    }

    //disables down button of last question from start
    if (this === this.parentNode.lastElementChild){
      this.downDisabled = true;
    }

  }

  //move up button
  __moveUp() {
    this.nodePlaceHolderOnUp = this.previousElementSibling;
    this.movedUp = true;
    this.parentNode.insertBefore(this, this.previousElementSibling);
  }

  //move down button
  __moveDown() {
    this.nodePlaceHolderOnDown = this.nextElementSibling;
    this.movedDown = true;
    this.parentNode.insertBefore(this, this.nextElementSibling.nextElementSibling);
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
