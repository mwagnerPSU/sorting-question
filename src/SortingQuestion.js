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
    this.title = "title";
    this.checked = false;
    this.solution = false;
    this.solutionDisabled = false;
    this.questionAmount = this.children.length;
    this.correctNum = 0;
    this.correctOrder = [];
    this.currentOrder = [];
    this.startElement;
    this.dropElement;


    //correct order of question are stored based on sq-question input
    //sets listeners
    this.querySelectorAll("sq-question").forEach(node => {
      this.correctOrder.push(node);

      //dragging initialization and listeners
      node.setAttribute("draggable", true);
      this.addEventListener("dragstart", this.dragStart);
      this.addEventListener("dragend", this.dragEnd);
      this.addEventListener("dragover", this.dragOver);
      this.addEventListener("dragenter", this.dragEnter);
      this.addEventListener("dragleave", this.dragLeave);
      this.addEventListener("drop", this.drop);
    });
    //shuffles questions upon load for user
    this.shuffleQuestions();
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      correctOrder: { type: Array },
      currentOrder: { type: Array },
      title: { type: String, reflect: true },
      checked: { type: Boolean, reflect: true },
      solution: { type: Boolean, reflect: true },
      solutionDisabled: { type: Boolean },
      correctNum: { type: Number },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {     
      //disables moving buttons when in checked state
      //reenables when out of checked state
      if (propName === "checked") {
        this.querySelectorAll("sq-question").forEach(node => {
          if(this.checked) {
            
            node.setAttribute('upDisabled', true);
            node.setAttribute('downDisabled', true);
            
            this.checkQuestions();
          }else{
              node.removeAttribute('upDisabled');
              node.removeAttribute('downDisabled');
          }
        });

        if(this.checked){
          this.querySelectorAll("sq-question").forEach(node => {
            node.removeAttribute("draggable");
          });
        }else{
          this.querySelectorAll("sq-question").forEach(node => {
            node.setAttribute("draggable", true);
          });
        }
      }
        

      //replaces question nodes with correct order
      //resets checked for visuals and correct num count
      if (propName === "solution") {
        if(this.solution){
          for(let i = 0; i < this.questionAmount; i++){
            let currentChild = this.children[i];
            
            //places correct node
            //removes equivalent node from parent
            currentChild.parentElement.insertBefore(this.correctOrder[i], currentChild);
          }
          this.checked = true;
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

  //shuffles questions
  shuffleQuestions() {
    this.querySelectorAll("sq-question").forEach(node => {
      const randNum = Math.floor(Math.random() * this.questionAmount);

      //gives the spot that a question is going to be placed before
      let referenceNode = this.children[randNum];

      node.parentElement.insertBefore(node, referenceNode);
    });
  }

  //check button
  __check() {
    this.checked = true;
  }

  //checks current question correctness
  checkQuestions() {
    //holds the amount of questions in the correct spot
    let checkedNum = 0;

    //used to track index of the correct array below
    let correctIndex = 0

    //runs through the current spots of each question and updates the correct amount
    document.querySelectorAll("sq-question").forEach(node => {
      if (this.correctOrder[correctIndex] === node) {
        //added if question is correct
        checkedNum++;
        node.setAttribute("correct", true);
      }else{
        node.setAttribute("correct", false);
      }
      //increased to get next correct question
      correctIndex++;
    });
    //sets the correct num for display use
    this.correctNum = checkedNum;

    //shoots confetti if all are correct
    if (this.correctNum === this.children.length) {
      // all credit to:
      // confetti-element by stefanjudis MIT
      // cleaned up for production use by lrnwebcomponents team
      import("../lib/confetti-container.js").then((module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      });
    }
  }

  //retry button
  __retry() {
    this.checked = false;
    this.solution = false;
    this.solutionDisabled = false;
    document.querySelectorAll("sq-question").forEach(node => {
      node.removeAttribute("correct");
    });
    this.shuffleQuestions();
  }

  __showSolution() {
    this.checked = false;
    this.solution = true;
    //disabled solution button
    this.solutionDisabled = true;
  }

  dragStart(event) {
    this.startElement = event.target;
    event.target.style.opacity = .5;
  }

  //styling reset
  dragEnd(event) {
    event.target.style.opacity = "";
  }

  //sets border of element hovered over
  dragEnter(event){
    event.preventDefault();
    event.target.style.border = "dashed 2px purple";
  }

  //allows drop
  dragOver(event){
    event.preventDefault();
  }

  //resets border
  dragLeave(event){
    event.target.style.border = "";
  }

  drop(event){
    //sets element dropped on
    this.dropElement = event.target;

    let firstPlace = "";
    let secondPlace = "";

    //checks position of element being dragged
    for (let i = 0; i < this.questionAmount; i++){
      if (this.children[i] === this.startElement){
        firstPlace = i;
      }
    }

    //checks position of element dropped on
    for (let i = 0; i < this.questionAmount; i++){
      if (this.children[i] === this.dropElement){
        secondPlace = i;
      }
    }

    //places dragged element before or after dropped on element based on if dragged down or up
    if(firstPlace > secondPlace) {
      this.insertBefore(this.startElement, this.dropElement);
      this.querySelectorAll("sq-question").forEach(node => {
        if(node === this.startElement) {
          node.setAttribute("draggedUp", true);
          node.setAttribute("draggedUp", false);
        }
        
      });
    } else if (firstPlace < secondPlace) {
      this.insertBefore(this.startElement, this.dropElement.nextElementSibling);
      this.querySelectorAll("sq-question").forEach(node => {
        if(node === this.startElement) {
          node.setAttribute("draggedDown", true);
          node.setAttribute("draggedDown", false);
        }
      });
    }
    event.target.style.border = "";
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: block;
        width: 700px;
        padding: 10px;
        border: 3px solid gray;
      }

      h2 {
        color: #000080;
      }

      .questionArea{
        color: #000080;
      }

      .checkArea {
        display: flex;
      }

      .checkButton {
        color: white;
        background-color: #1a73d9;
        border-radius: 5px;
        font-size: 12pt;
        padding: 2px 10px;
      }

      .statusText {
        margin-right: 20px;
        font-size: 14pt;
      }

      .resetButton {
        color: white;
        background-color: #1a73d9;
        border-radius: 5px;
        font-size: 12pt;
        padding: 2px 10px;
      }

      .solutionButton {
        color: white;
        background-color: #1a73d9;
        border-radius: 5px;
        font-size: 12pt; 
        padding: 2px 10px;
        margin-left: 20px;
      }

      button {
        box-shadow: 1px 1px 1px gray;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <confetti-container id="confetti">
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
              <button class="solutionButton" @click="${this.__showSolution}" ?disabled="${this.solutionDisabled}" tabindex="-1">Show Solution</button>
            `
          }
        </div> 
      </confetti-container>
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
