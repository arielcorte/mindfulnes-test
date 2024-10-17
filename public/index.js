const Percentage = class {
  value;
  name;
};

const Field = class {
  name;
  questions = [];
  percentages = [];
  languageTotal;
  total;

  constructor({ name, questions, percentages }) {
    this.name = name;
    this.questions = questions;
    this.percentages = percentages;
  }

  /**
   * Calculates field result
   * @param {string[]} results - The test results
   */
  calculateResult(results) {
    let total = 0;
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (q == 0) {
        throw new Error("Invalid qustion number");
      }
      total += results[q - 1];
    }

    this.total = total;
  }

  /**
   * Calculates field percentage
   */
  calculatePercentage() {
    console.log(this.percentages);
    for (let i = this.percentages.length - 1; i > 0; i--) {
      console.log(this.total, this.percentages[i].value);
      if (this.total >= this.percentages[i].value) {
        this.languageTotal = this.percentages[i].name;
        return;
      }
    }

    this.languageTotal = this.percentages[0].name;
  }

  /**
   * Calculates field result
   * @param {string[]} results - The test results
   */
  calculate(results) {
    try {
      this.calculateResult(results);
      this.calculatePercentage();
    } catch (e) {
      throw e;
    }
  }
};

const Mindfulness = class {
  results = [];
  invert = [];
  invertedResults = [];
  fields;
  outOf;

  /**
   * Returns
   * @constructor
   * @param {ConfigMindfulness} config - The config object
   * @returns
   */
  constructor(config) {
    const DefaultPercentages = [
      { name: "Muy bajo" },
      { name: "Bajo", value: 15 },
      { name: "Moderado", value: 20 },
      { name: "Alto", value: 26 },
      { name: "Muy alto", value: 33 },
    ];

    for (let i = 0; i < config.fields.length; i++) {
      const f = config.fields[i];

      if (!f.percentages || f.percentages.length == 0) {
        f.percentages = DefaultPercentages;
      }
    }

    this.results = config.results;
    this.invert = config.invert;
    this.fields = config.fields;

    if (config.outOf != null) {
      this.outOf = config.outOf;
    } else {
      this.outOf = 5;
    }
  }

  calculateTest() {
    if (this.invertedResults.length == 0) {
      throw new Error("Not calculated inverted results");
    }

    for (let i = 0; i < this.fields.length; i++) {
      try {
        this.fields[i].calculate(this.invertedResults);
      } catch (e) {
        throw e;
      }
    }
  }

  invertResults() {
    this.invertedResults = this.results;

    for (let i = 0; i < this.invert.length; i++) {
      const inv = this.invert[i];
      if (inv == 0) {
        throw new Error("Invalid invert question number");
      }
      this.invertedResults[inv - 1] = this.outOf + 1 - this.results[inv - 1];
    }
  }

  calculate() {
    if (this.results.length == 0) {
      throw new Error("Not results given");
    }
    try {
      this.invertResults();
      this.calculateTest();
    } catch (e) {
      throw e;
    }
  }
};

const ConfigMindfulness = class {
  results;
  invert;
  fields;
  outOf;
};

function FormatMindfulness(m) {
  let formatted = "";

  for (let i = 0; i < m.fields.length; i++) {
    const f = m.fields[i];
    formatted += `${f.name}: ${f.languageTotal} (${f.total})\n`;
  }

  return formatted;
}

function main(config) {
  const mind = new Mindfulness(config);
  try {
    mind.calculate();
  } catch (e) {
    console.error("An error occured while calculating: ", e);
  }

  return FormatMindfulness(mind);
}
