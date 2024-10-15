package main

import (
	"errors"
	"fmt"
	"log"
)

type Percentage struct {
	Value int
	Name  string
}

type Field struct {
	Name          string
	Questions     []int
	Percentages   []Percentage
	LanguageTotal string
	Total         int
}

type Mindfulness struct {
	Results         []int
	Invert          []int
	InvertedResults []int
	Fields          []Field
	OutOf           int
}

func (f *Field) calculateResult(results []int) error {
	total := 0
	for _, q := range f.Questions {
		if q == 0 {
			return errors.New("Invalid qustion number")
		}
		total += results[q-1]
	}

	f.Total = total

	return nil
}

func (f *Field) calculatePercentage() error {
	for i := len(f.Percentages) - 1; i > 0; i-- {
		if f.Total >= f.Percentages[i].Value {
			f.LanguageTotal = f.Percentages[i].Name
			return nil
		}
	}

	return errors.New("Something went wrong while calculating percentage")
}

func (m *Mindfulness) calculateTest() error {
	if len(m.InvertedResults) == 0 {
		return errors.New("Not calculated inverted results")
	}

	for i := 0; i < len(m.Fields); i++ {
		if err := m.Fields[i].Calculate(m.InvertedResults); err != nil {
			return err
		}
	}

	return nil
}

func (f *Field) Calculate(results []int) error {
	if err := f.calculateResult(results); err != nil {
		return err
	}
	if err := f.calculatePercentage(); err != nil {
		return err
	}
	return nil
}

func (m *Mindfulness) invertResults() error {

	m.InvertedResults = m.Results

	for _, inv := range m.Invert {
		if inv == 0 {
			return errors.New("Invalid invert question number")
		}
		m.InvertedResults[inv-1] = m.OutOf + 1 - m.Results[inv-1]
	}
	return nil
}

func (m *Mindfulness) Calculate() error {
	if len(m.Results) == 0 {
		return errors.New("Not results given")
	}
	if err := m.invertResults(); err != nil {
		return err
	}
	if err := m.calculateTest(); err != nil {
		return err
	}
	return nil
}

type ConfigMindfulness struct {
	Results []int
	Invert  []int
	Fields  []Field
	OutOf   *int
}

func NewMindfulness(config *ConfigMindfulness) Mindfulness {

	DefaultPercentages := []Percentage{
		{Name: "Muy bajo"},
		{Name: "Bajo", Value: 15},
		{Name: "Moderado", Value: 20},
		{Name: "Alto", Value: 26},
		{Name: "Muy alto", Value: 33},
	}

	for i := 0; i < len(config.Fields); i++ {
		f := &config.Fields[i]

		if len(f.Percentages) == 0 {
			f.Percentages = DefaultPercentages
		}
	}

	m := Mindfulness{
		Results: config.Results,
		Invert:  config.Invert,
		Fields:  config.Fields,
	}

	if config.OutOf != nil {
		m.OutOf = *config.OutOf
	} else {
		m.OutOf = 5
	}

	return m
}

func FormatMindfulness(m *Mindfulness) string {

	formatted := ""

	for i := 0; i < len(m.Fields); i++ {
		f := &m.Fields[i]
		formatted += fmt.Sprintf("%s: %s (%d)\n", f.Name, f.LanguageTotal, f.Total)
	}

	return formatted
}

func main() {
	config := ConfigMindfulness{
		Results: []int{4, 2, 5, 2, 4, 4, 4, 5, 3, 4, 5, 5, 4, 3, 4, 5, 4, 4, 1, 4, 4, 1, 5, 5, 3, 5, 3, 3, 5, 1, 4, 3, 5, 3, 3, 4, 2, 3, 4},
		Invert:  []int{4, 5, 8, 10, 12, 13, 14, 16, 17, 18, 22, 23, 25, 28, 30, 34, 35, 38, 39},
		Fields: []Field{
			{
				Name:      "Observar",
				Questions: []int{1, 6, 11, 15, 20, 26, 31, 36},
			},
			{
				Name:      "Describir",
				Questions: []int{2, 7, 12, 16, 22, 27, 32, 37},
			},
			{
				Name:      "Actuar con conciencia",
				Questions: []int{5, 8, 13, 18, 23, 28, 34, 38},
			},
			{
				Name:      "No enjuiciar",
				Questions: []int{3, 10, 14, 17, 25, 30, 35, 39},
			},
			{
				Name:      "No reaccionar",
				Questions: []int{4, 9, 19, 21, 24, 29, 33},
				Percentages: []Percentage{
					{Name: "Muy bajo"},
					{Name: "Bajo", Value: 14},
					{Name: "Moderado", Value: 17},
					{Name: "Alto", Value: 22},
					{Name: "Muy alto", Value: 28},
				},
			},
		},
	}

	mind := NewMindfulness(&config)
	err := mind.Calculate()
	if err != nil {
		log.Fatal("An error occured while calculating: ", err)
	}

	fmt.Println(FormatMindfulness(&mind))
}
