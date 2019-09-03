export const classLookup = {
  ho: 'Health Outcome',
  int: 'Intervention',
  rf: 'Risk Factor'
};

export const getPinnedTextFromData = (data) => (data.subcat === undefined
  ? classLookup[data.class] : data.subcat);

const pinnedLabs = [
  'Blood/Immune', 'Cardiovascular', 'CNS', 'Endocrine', 'Gastrointestinal', 'Genitourinary',
  'Integument', 'Musculoskeletal', 'PNS', 'Respiratory', 'Cognitive', 'Emotional', 'Language',
  'Motor', 'Health Outcome', 'Intervention', 'Risk Factor'
];

export const pinnedLabWidths = {};

const tmpEl = document.createElement('canvas');
const ctx = tmpEl.getContext('2d');
ctx.font = 'italic 15px "Roboto Condensed"';

pinnedLabs.forEach((d) => {
  pinnedLabWidths[d] = ctx.measureText(d).width + 5;
});
