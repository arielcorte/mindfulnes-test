const Percentage = class {
  value;
  name;
};

const Field = class {
  name;
  questions;
  percentages;
  languageTotal;
  total;

  /**
   * Calculates field result
   * @param {string[]} results - The test results
   */
  calculateResult(results) {
    let total = 0;
    for (let i = 0; i < this.questions.length(); i++) {
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
    for (let i = this.percentages.lenght - 1; i > 0; i--) {
      if (this.total >= this.percentages[i].value) {
        this.languageTotal = this.percentages[i].name;
      }
    }

    throw new Error("Something went wrong while calculating percentage");
  }

  /**
   * Calculates field result
   * @param {string[]} results - The test results
   */
  Calculate(results) {
    try {
      this.calculateResult(results);
      this.calculatePercentage();
    } catch (e) {
      throw e;
    }
  }
};

const Mindfulness = class {
  results;
  invert;
  invertedResults;
  fields;
  outOf;

  /**
   * Returns
   * @constructor
   * @param {ConfigMindfulness} config - The config object
   * @returns
   */
  constructor(config) {
    console.log("initializing");
    const DefaultPercentages = [
      { name: "Muy bajo" },
      { name: "Bajo", value: 15 },
      { name: "Moderado", value: 20 },
      { name: "Alto", value: 26 },
      { name: "Muy alto", value: 33 },
    ];

    for (let i = 0; i < config.fields.length; i++) {
      const f = config.fields[i];

      if (f.percentages.length == 0) {
        f.percentages = DefaultPercentages;
      }
    }

    let m = {
      results: config.results,
      invert: config.invert,
      fields: config.fields,
    };

    if (config.outOf != null) {
      m.outOf = config.outOf;
    } else {
      m.outOf = 5;
    }

    return m;
  }

  calculateTest() {
    if (this.invertedResults.length == 0) {
      throw new Error("Not calculated inverted results");
    }

    for (let i = 0; i < this.fields.length; i++) {
      try {
        m.fields[i].Calculate(m.invertedResults);
      } catch (e) {
        throw e;
      }
    }

    return nil;
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
  Calculate() {
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
    formatted += fmt.Sprintf("%s: %s (%d)\n", f.name, f.languageTotal, f.total);
  }

  return formatted;
}

function main() {
  const config = {
    results: [
      4, 2, 5, 2, 4, 4, 4, 5, 3, 4, 5, 5, 4, 3, 4, 5, 4, 4, 1, 4, 4, 1, 5, 5, 3,
      5, 3, 3, 5, 1, 4, 3, 5, 3, 3, 4, 2, 3, 4,
    ],
    invert: [
      4, 5, 8, 10, 12, 13, 14, 16, 17, 18, 22, 23, 25, 28, 30, 34, 35, 38, 39,
    ],
    fields: [
      {
        name: "Observar",
        questions: [1, 6, 11, 15, 20, 26, 31, 36],
      },
      {
        name: "Describir",
        questions: [2, 7, 12, 16, 22, 27, 32, 37],
      },
      {
        name: "Actuar con conciencia",
        questions: [5, 8, 13, 18, 23, 28, 34, 38],
      },
      {
        name: "No enjuiciar",
        questions: [3, 10, 14, 17, 25, 30, 35, 39],
      },
      {
        name: "No reaccionar",
        questions: [4, 9, 19, 21, 24, 29, 33],
        percentages: [
          { name: "Muy bajo" },
          { name: "Bajo", value: 14 },
          { name: "Moderado", value: 17 },
          { name: "Alto", value: 22 },
          { name: "Muy alto", value: 28 },
        ],
      },
    ],
  };

  const mind = new Mindfulness(config);
  try {
    mind.Calculate();
  } catch (e) {
    console.error("An error occured while calculating: ", e);
  }

  console.log(FormatMindfulness(mind));
}
