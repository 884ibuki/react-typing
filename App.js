// TypingGame.js

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const TypingGame = () => {
  const [question, setQuestion] = useState({ kanji: '', romaji: '' });
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [topRanking, setTopRanking] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    generateRandomQuestion();
    inputRef.current.focus();
  }, [questionIndex]); // Update when questionIndex changes

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      setEndTime(new Date());
      if (startTime) {
        // Save the result and update top ranking
        const questionsPerMinute = questionIndex;
        updateTopRanking(questionsPerMinute);
      }
      // Move to the next question and reset input field
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setUserInput('');
      setStartTime(null); // Reset start time
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const generateRandomQuestion = () => {
    const questions = [
      { kanji: 'いぬ', romaji: 'inu' },
      { kanji: 'ねこ', romaji: 'neko' },
      { kanji: 'かわうそ', romaji: 'kawauso' },
      { kanji: 'きりん', romaji: 'kirinn' },      { kanji: 'こあら', romaji: 'koara' },
      { kanji: 'いざかや', romaji: 'izakaya' },
      
      { kanji: 'だいがく', romaji: 'daigaku' },
      { kanji: 'せいけいだいがく', romaji: 'seikeidaigaku' },
      { kanji: 'こうぎ', romaji: 'kougi' },
      { kanji: 'せいせき', romaji: 'seiseki' },
      { kanji: 'がくもん', romaji: 'gakumonn' },
      { kanji: 'けんきゅう', romaji: 'kenkyuu' },
      { kanji: 'こうどう', romaji: 'koudou' },
      { kanji: 'がくひ', romaji: 'gakuhi' },
      { kanji: 'りゅうがく', romaji: 'ryuugaku' },
      { kanji: 'だいがくさい', romaji: 'daigakusai' },
      { kanji: 'かだい', romaji: 'kadai' },
      { kanji: 'せんたくかもく', romaji: 'senntakukamoku' },
      { kanji: 'しんろ', romaji: 'shinnro' },
      { kanji: 'がくないいべんと', romaji: 'gakunaiibennto' },
      { kanji: 'きゃりくらむらいふ', romaji: 'kyarikuramuraifu' },
      { kanji: 'りょうかい', romaji: 'ryoukai' },
      { kanji: 'がくせいりょう', romaji: 'gakuseiryou' },
      { kanji: 'せいじゅく', romaji: 'seijuku' },
      { kanji: 'がくせいろう', romaji: 'gakuseirou' },
      { kanji: 'がくせいしんぶん', romaji: 'gakuseishinnbunn' },
      { kanji: 'はくぶつかん', romaji: 'hakubutsukann' },
      { kanji: 'ちいきれんけい', romaji: 'chiikirennkei' },
      { kanji: 'がくせい じち', romaji: 'gakusei jichi' },
      { kanji: 'だいがくあんない', romaji: 'daigakuannai' },
      { kanji: 'えんそく', romaji: 'ennsoku' },
      { kanji: 'せいけいぶんか', romaji: 'seikeibunnka' },
      // 他の単語も同様に追加
    ];

    if (questionIndex < questions.length) {
      setQuestion(questions[questionIndex]);
    } else {
      // If all questions are done, end the game
      setEndTime(new Date());
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (!startTime) {
      setStartTime(new Date());
    }

    if (input === question.romaji.slice(0, input.length)) {
      // Continue typing
      if (input === question.romaji) {
        setEndTime(new Date());
        if (timeLeft > 0) {
          // Save the result and update top ranking
          const questionsPerMinute = questionIndex + 1;
          updateTopRanking(questionsPerMinute);
        }
        // Move to the next question and reset input field
        setQuestionIndex((prevIndex) => prevIndex + 1);
        setUserInput('');
      }
    } else {
      // Incorrect typing, reset the timer
      setStartTime(new Date());
    }
  };

  const updateTopRanking = (questionsPerMinute) => {
    setTopRanking((prevTopRanking) => {
      if (prevTopRanking === null || questionsPerMinute > prevTopRanking) {
        return questionsPerMinute;
      }
      return prevTopRanking;
    });
  };

  const restartGame = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(60);
    setQuestionIndex(0);
    setTopRanking(null);
    generateRandomQuestion();
    inputRef.current.focus();
  };
  return (
    <div className="typing-game-container">
      <header className="game-header neon-background">
        <h1 className="game-title neon">モモタイプ</h1>
      </header>
      <div className="question-container">
        <p className="kanji neon">{question.kanji}</p>
        <p className="romaji neon">{question.romaji}</p>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="ここに入力してください..."
        className="input-field neon"
        disabled={timeLeft === 0}
      />
      <p className="time-left neon">残り時間: {timeLeft}秒</p>
      {timeLeft === 0 && (
        <div className="game-over-container">
          <p className="game-over-message neon">ゲーム終了！</p>
          <p className="result-message neon">一分間に解けた問題数: {questionIndex}</p>
          {topRanking !== null && (
            <p className="rankings neon">今までの成蹊生の最高記録は {topRanking} 問!<br/>成蹊のタイピング王になれましたか？</p>
          )}
          <button onClick={restartGame} className="restart-button neon">
            リスタート
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingGame;