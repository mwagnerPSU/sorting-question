// dependencies / things imported
import { LitElement, html, css } from 'lit';
import './sq-question.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class SortingQuestion extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'sorting-question';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    //this.need = 'all need to succeed';
    this.title = "Gimme a title!";
    this.checked = false;
    this.questionAmount = this.children.length;
    this.correctNum = 0;
    this.correctOrder = [];
    this.currentOrder = [];

    console.log(`Children: ${this.questionAmount}`);

    this.querySelectorAll("sq-question").forEach(node => {
      this.correctOrder.push(node);
    });

    console.log('correct order:');
    console.log(this.correctOrder);

    this.shuffleQuestions();
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      //need: { type: String, reflect: true },
      correctOrder: { type: Array },
      currentOrder: { type: Array },
      title: { type: String, reflect: true },
      checked: { type: Boolean, reflect: true },
      correctNum: { type: Number },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // if (propName === 'need' && this[propName] === 'joy') {
      //   this.classList.add('joyful');
      // }

      if (propName === "checked") {
        if(this.checked) {
          this.checkQuestions();
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
  }

  // HTMLElement life-cycle, element has been connected to the page / added or moved
  // this fires EVERY time the element is moved
  connectedCallback() {
    super.connectedCallback();
  }

  // HTMLElement life-cycle, element has been removed from the page OR moved
  // this fires every time the element moves
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  makeRandNum() {
    const randNum = Math.floor(Math.random() * this.questionAmount);

    return randNum;
  }

  shuffleQuestions() {
    this.querySelectorAll("sq-question").forEach(node => {
      const randNum = Math.floor(Math.random() * this.questionAmount);

      //gives the spot that a question is going to be placed before
      let referenceNode = this.children[randNum];

      node.parentElement.insertBefore(node, referenceNode);
    });
  }

  __check() {
    this.checked = true;
  }

  checkQuestions() {
    let checkedNum = 0;

    for (let i = 0; i < this.questionAmount; i++) {
      if(this.children[i].isEqualNode(this.correctOrder[i])){
        checkedNum++;
      }
    }
    
    this.correctNum = checkedNum;
  }

  __retry() {
    this.checked = false;
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: block;
        width: 700px;
        padding: 10px;
        border: 1px solid gray;
      }

      /* :host([need='joy']) {
        color: yellow;
        background-color: black;
      } */

      .checkArea {
        display: flex;
      }

      .checkButton {
        color: white;
        background-color: #1a73d9;
        border-radius: 20px;
        font-size: 12pt;
        padding: 2px 10px;
      }

      .statusText {
        margin-right: 20px;
      }

      .resetButton {
        color: white;
        background-color: #1a73d9;
        border-radius: 20px;
        font-size: 12pt;
        padding: 2px 10px;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <h2>${this.title}</h2>

      <div class="questionArea"><slot></slot></div>

      <div class="checkArea">
        ${!this.checked
          ? html`
            <button class="checkButton" @click="${this.__check}" tabindex='-1'>
              <simple-icon-lite icon="check"></simple-icon-lite>

              Check
            </button>
          `
          : html`
            <p class="statusText">Correct: ${this.correctNum}</p>
            <button class="resetButton" @click="${this.__retry}" tabindex="-1">Retry</button>
          `
        }
      </div> 
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(
      `../lib/sorting-question.haxProperties.json`,
      import.meta.url
    ).href;
  }
}

window.customElements.define(SortingQuestion.tag, SortingQuestion);
