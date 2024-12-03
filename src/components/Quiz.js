// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.1.20:4000');

const Quiz = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    socket.on('question', (data) => {
      console.log('Received question:', data);
      setQuestion(data);
    });

    socket.on('newAnswer', (data) => {
      setAnswers((prevAnswers) => {
        const newAnswers = { ...prevAnswers };
        if (!newAnswers[data.index]) {
          newAnswers[data.index] = [];
        }
        newAnswers[data.index].push(data.answer);
        return newAnswers;
      });
    });

    // Request the first question
    console.log('Requesting question for index:', questionIndex);
    socket.emit('getQuestion', questionIndex);

    // Cleanup on component unmount
    return () => {
      socket.off('question');
      socket.off('newAnswer');
    };
  }, [questionIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('submitAnswer', { index: questionIndex, answer });
    setAnswer('');
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '40px auto', 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '10px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    }}>
      <h1 style={{ 
        color: '#333', 
        textAlign: 'center', 
        marginBottom: '30px',
        fontSize: '24px'
      }}>{question}</h1>
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px' 
      }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            flex: '1',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>Submit</button>
      </form>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px' 
      }}>
        <button onClick={handlePreviousQuestion} style={{
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 5px rgba(33, 150, 243, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '20px' }}>←</span>
       
        </button>
        <button onClick={handleNextQuestion} style={{
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 5px rgba(33, 150, 243, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          
          <span style={{ fontSize: '20px' }}>→</span>
        </button>
      </div>
      <ul style={{
        listStyle: 'none',
        padding: '0',
        margin: '0'
      }}>
        {(answers[questionIndex] || []).map((ans, index) => (
          <li key={index} style={{
            padding: '10px',
            backgroundColor: 'white',
            marginBottom: '10px',
            borderRadius: '5px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>{ans}</li>
        ))}
      </ul>
    </div>
  );
};

export default Quiz;