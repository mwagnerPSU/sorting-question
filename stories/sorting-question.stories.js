import { html } from 'lit';

import '../src/SortingQuestion.js';
import '../src/sq-question.js';

export default {
  title: 'Sorting Question',
  component: 'sorting-question',
  argTypes: {
   title: { control: 'text' },
  },
};

//for some reason answer checking, dragging, and showing solution dont work when slot is
//used in template like below
//if the <sq-question>s are placed in the template, all functionality works
function Template({ title = 'Title', slot }) {
  return html`
    <sorting-question title="${title}">
      ${slot}
    </sorting-question>
  `;
}


export const SentenceStructure = Template.bind({});
SentenceStructure.args = {
  title: 'My morning routine:',
  slot: html`
    <sq-question>First, I wake up at 7:30 am</sq-question>
    <sq-question>Next, I get dressed</sq-question>
    <sq-question>Then, I have breakfast</sq-question>
    <sq-question>Afterward, I brush my teeth</sq-question>
    <sq-question>Lastly, I go to school</sq-question>
  `,
};

export const NumberSort = Template.bind({});
NumberSort.args = {
  title: 'Put the numbers in order from least to greatest:',
  slot: html`
    <sq-question>5</sq-question>
    <sq-question>10</sq-question>
    <sq-question>15</sq-question>
    <sq-question>20</sq-question>
    <sq-question>25</sq-question>
  `,
};

