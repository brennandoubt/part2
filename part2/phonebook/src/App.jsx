import { useState } from "react"

const Person = ({ name, number }) => <div>{name} {number}</div>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // for controlling form input element
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [showName, setShowName] = useState('')  // for filtering by search

  // executes when clicking form button
  const addPerson = (event) => {
    event.preventDefault()
    
    // check if name already in phonebook
    const isNotDuplicate = persons.every(person => (person.name != newName))
    if (!isNotDuplicate) {
      alert(`${newName} is already added to phonebook`)  // browser pop-up alert w/ template string
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  // filter people by name search
  let personsToShow = persons.filter(person => person.name.toLowerCase().includes(showName.toLowerCase()))

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    const updatedShowName = event.target.value
    personsToShow = persons.filter(person => person.name.toLowerCase().includes(updatedShowName.toLowerCase()))
    setShowName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input value={showName} onChange={handleFilterChange} />
      </div>
      <h2>add a new entry</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(p => <Person key={p.id} name={p.name} number={p.number} />)}
    </div>
  )
}

export default App