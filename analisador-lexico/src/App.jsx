import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [newWord, setNewWord] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [words, setWords] = useState([])
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const headers = [
    '-',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  const handleAddWord = () => {
    if (!newWord.trim()) return
    setWords((prevWords) => [...prevWords, newWord.trim()])
    console.log(words)
    setNewWord('')
  }

  const handleRemoveWord = () => {
    setWords((prevWords) => prevWords.filter((_, index) => index !== hoveredIndex))
    setHoveredIndex(null)
  }

  return (
    <>
      <div className='justify-center items-start flex flex-col gap-4 m-10'>
        <p className='font-bold text-2xl'>Analisador Léxico</p>
      </div>
      <div className='justify-center items-center flex flex-col gap-10 m-10'>
        <div className='flex w-full flex-col gap-4 md:flex-row md:items-stretch'>
          <div className='flex flex-1 basis-0 flex-col justify-center gap-2 border rounded-md p-10'>
            <label className='font-semibold'>Nova palavra:</label>
            <textarea
              className='border-2 border-gray-300 rounded-md p-2 w-full h-12 resize-none'
              value={newWord}
              onChange={(event) => setNewWord(event.target.value)}
            ></textarea>
            <button 
              className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-2/6 cursor-pointer'
              onClick={handleAddWord}>
                Adicionar
            </button>
            <div className='mt-4 gap-2 flex flex-wrap'>
              {words.map((word, index) => (
                <span
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={handleRemoveWord}
                  className='bg-green-300 text-slate-800 font-medium rounded-md px-3 py-1 inline-flex cursor-pointer hover:bg-red-300'
                >
                  {word}
                  {hoveredIndex === index && (
                    <button
                      onClick={handleRemoveWord}
                      className='ml-2 text-red-600 font-semibold cursor-pointer'
                      >
                      
                    </button>
                  )}
                </span>               
              ))}

            </div>
          </div>
          <div className='flex flex-1 basis-0 flex-col gap-2 border rounded-md p-10'>
            <label className='font-semibold'>Buscar Palavra:</label>
            <textarea
              className='border-2 border-gray-300 rounded-md p-2 w-full h-12 resize-none'
              value={searchWord}
              onChange={(event) => setSearchWord(event.target.value)}
            ></textarea>
            <button className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-2/6 cursor-pointer'>Buscar</button>
          </div>
        </div>
        <div className='w-full flex justify-center px-4'>
          <div className='table-wrapper w-full max-w-5xl overflow-x-auto'>
            <table className='lex-table table-fixed border-collapse border border-gray-400 w-full text-lg'>
              <thead id='thead'>
                <tr>
                  {headers.map((header) => (
                    <th key={header} className='text-center uppercase tracking-wide'>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody id='tbody'></tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
