import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [notesInput, setNotesInput] = useState("");
  const [result, setResult] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: notesInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
   
      // Split the data.result into an array of segments using a regular expression
      const segments = data.result.split(/(:)/);
      const tmpQuestions = [];
      const tmpAnswers = [];
      for(let i = 2; i <= segments.length-3; i+=4){
        tmpQuestions.push(segments[i].substring(0, segments[i].indexOf("?")));
      } 
      setQuestions(tmpQuestions);
      for(let i = 4; i <= segments.length-1; i+=4){
        tmpAnswers.push(segments[i]);
      }
      setAnswers(tmpAnswers);
      
      // console.log(segments);
      // console.log(questions);
      console.log(answers);

      setNotesInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Flashcard Generator</title>
      </Head>
      <main className={styles.main}>
        <h3>Flashcard Generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="notes"
            placeholder="copy your notes"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
          />
          <input type="submit" value="Generate cards" />
        </form>

        <h1>Flashcards</h1>
        {/* <div style={{width: '500px', height: '200px',}}  class="box red" id="myBox">Flashcard 1: questions[0]</div> */}
        {/* <button id="toggleButton">Flip Flashcard</button> */}

        {/* <div className={styles.result}>{result}</div> */}

        {/* <div id="myBox" className={styles.flashcard}></div> */}
        {/* <button id="toggleButton">Toggle Flashcard</button> */}

        <div class="flashcards-container">
        <div class="flashcard">
            <h3>Flashcard 1</h3>
            <p>Question: {questions[0]}</p>
            <p>Answer: {answers[0]}</p>
        </div>

        <div class="flashcard">
            <h3>Flashcard 2</h3>
            <p>Question: {questions[1]}</p>
            <p>Answer: {answers[1]}</p>
        </div>

        <div class="flashcard">
            <h3>Flashcard 3</h3>
            <p>Question: {questions[2]}</p>
            <p>Answer: {answers[2]}</p>
        </div>
    </div>

        {/* <div className={styles.result}>{result}</div> */}
      </main>
    </div>
  );
}
