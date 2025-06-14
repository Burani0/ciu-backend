// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import axios from 'axios';
// import PDFParser from 'pdf2json';
// import cors from 'cors';

// // Initialize Express app
// const app = express();
// app.use(express.json());

// // Enable CORS for the frontend origin
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true,
// }));

// // Create HTTP server and integrate with Socket.IO
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true,
//     transports: ['websocket', 'polling'],
//   },
// });

// // Socket.IO room management
// const rooms = new Map();

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join-room', (roomId) => {
//     try {
//       socket.join(roomId);
//       if (!rooms.has(roomId)) {
//         rooms.set(roomId, { viewers: new Set(), streamer: null });
//       }
//       const room = rooms.get(roomId);

//       const isStreamer = socket.handshake.headers.referer?.includes('/stream/');
//       if (isStreamer) {
//         room.streamer = socket.id;
//       } else {
//         room.viewers.add(socket.id);
//       }

//       io.to(roomId).emit('room-update', {
//         viewerCount: room.viewers.size,
//         hasStreamer: !!room.streamer,
//       });
//     } catch (error) {
//       console.error('Error in join-room:', error);
//     }
//   });

//   socket.on('stream-video', (data) => {
//     try {
//       const roomId = Array.from(socket.rooms)[1];
//       if (roomId) {
//         console.log(`Broadcasting stream to room ${roomId}. Data size: ${data.length}`);
//         socket.to(roomId).emit('receive-stream', data);
//       }
//     } catch (error) {
//       console.error('Error in stream-video:', error);
//     }
//   });

//   socket.on('leave-room', () => {
//     try {
//       const roomId = Array.from(socket.rooms)[1];
//       if (roomId) {
//         const room = rooms.get(roomId);
//         if (room) {
//           if (room.streamer === socket.id) {
//             room.streamer = null;
//           } else {
//             room.viewers.delete(socket.id);
//           }
//           io.to(roomId).emit('room-update', {
//             viewerCount: room.viewers.size,
//             hasStreamer: !!room.streamer,
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error in leave-room:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     try {
//       rooms.forEach((room, roomId) => {
//         if (room.streamer === socket.id) {
//           room.streamer = null;
//         } else {
//           room.viewers.delete(socket.id);
//         }
//         io.to(roomId).emit('room-update', {
//           viewerCount: room.viewers.size,
//           hasStreamer: !!room.streamer,
//         });
//       });
//       console.log('User disconnected:', socket.id);
//     } catch (error) {
//       console.error('Error in disconnect:', error);
//     }
//   });
// });

// // PDF parsing endpoint




// app.post('/pdf', async (req, res) => {
//   const { pdfUrl } = req.body;
//   console.log('Received PDF URL:', pdfUrl);

//   if (!pdfUrl) {
//     console.error('No PDF URL provided');
//     return res.status(400).json({ error: 'No PDF URL provided' });
//   }

//   if (!pdfUrl.match(/^https?:\/\//)) {
//     console.error('Invalid PDF URL:', pdfUrl);
//     return res.status(400).json({ error: 'Invalid PDF URL' });
//   }

//   try {
//     console.log('Fetching PDF from:', pdfUrl);
//     const response = await axios.get(pdfUrl, {
//       responseType: 'arraybuffer',
//       timeout: 15000,
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//       },
//     });
//     console.log('PDF fetched, size:', response.data.length, 'bytes');

//     const pdfParser = new PDFParser();

//     pdfParser.on('pdfParser_dataError', (errData) => {
//       console.error('Error parsing PDF:', errData.parserError);
//       res.status(500).json({
//         error: 'Failed to parse PDF',
//         details: errData.parserError,
//       });
//     });

//     pdfParser.on('pdfParser_dataReady', (pdfData) => {
//       try {
//         const lines = [];
//         pdfData.Pages.forEach((page) => {
//           const pageLines = page.Texts.map((text) => {
//             try {
//               // Decode and clean text
//               let decoded = decodeURIComponent(text.R[0].T).trim();
//               // Remove extra spaces and control characters
//               decoded = decoded.replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
//               return decoded;
//             } catch (e) {
//               console.warn('Failed to decode text:', text.R[0].T);
//               return text.R[0].T.trim();
//             }
//           }).filter((line) => line && line.length > 1); // Filter out empty or single-character lines
//           lines.push(...pageLines);
//         });

//         console.log('Parsed PDF lines (first 20):', lines.slice(0, 20));
//         res.json({ lines });
//       } catch (error) {
//         console.error('Error processing parsed PDF data:', error.message);
//         res.status(500).json({
//           error: 'Failed to process parsed PDF data',
//           details: error.message,
//         });
//       }
//     });

//     pdfParser.parseBuffer(response.data);
//   } catch (error) {
//     console.error('Error fetching PDF:', error.message, error.response?.status || '');
//     res.status(500).json({
//       error: 'Failed to fetch PDF',
//       details: error.response
//         ? `Server responded with status ${error.response.status}: ${error.message}`
//         : error.request
//         ? 'No response received'
//         : error.message,
//       status: error.response?.status,
//     });
//   }
// });


// // app.post('/pdf', async (req, res) => {
// //   const { pdfUrl } = req.body;

// //   if (!pdfUrl || !/^https?:\/\//.test(pdfUrl)) {
// //     return res.status(400).json({ error: 'Invalid or missing PDF URL' });
// //   }

// //   try {
// //     const response = await axios.get(pdfUrl, {
// //       responseType: 'arraybuffer',
// //       headers: {
// //         'User-Agent': 'Mozilla/5.0',
// //       },
// //       timeout: 10000,
// //     });

// //     const pdfParser = new PDFParser();

// //     pdfParser.on('pdfParser_dataError', (errData) => {
// //       console.error('PDF parsing error:', errData.parserError);
// //       res.status(500).json({ error: 'Failed to parse PDF', details: errData.parserError });
// //     });

// //     pdfParser.on('pdfParser_dataReady', (pdfData) => {
// //       try {
// //         const lines = [];

// //         // Extract text from each page
// //         for (const page of pdfData.Pages) {
// //           for (const text of page.Texts) {
// //             try {
// //               let decoded = decodeURIComponent(text.R[0].T).trim();
// //               decoded = decoded.replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
// //               if (decoded.length > 1) lines.push(decoded);
// //             } catch {
// //               // Fallback
// //               lines.push(text.R[0].T.trim());
// //             }
// //           }
// //         }

// //         // Categorize based on patterns
// //         const title = lines.find(line => /examination|exam/i.test(line)) || '';
// //         const instructions = lines.filter(line => /instructions|read carefully/i.test(line));
// //         const sections = lines.filter(line => /section\s+[A-Z]/i.test(line));
// //         const questions = lines.filter(line => /^[0-9]+\./.test(line));

// //         const result = {
// //           title,
// //           instructions,
// //           sections,
// //           questions,
// //           allTextLines: lines,
// //         };

// //         res.json(result);
// //       } catch (err) {
// //         res.status(500).json({ error: 'Error processing PDF data', details: err.message });
// //       }
// //     });

// //     pdfParser.parseBuffer(response.data);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch PDF', details: err.message });
// //   }
// // });














// // app.post('/pdf', async (req, res) => {
// //   const { pdfUrl } = req.body;
// //   console.log('Received PDF URL:', pdfUrl);

// //   if (!pdfUrl) {
// //     console.error('No PDF URL provided');
// //     return res.status(400).json({ error: 'No PDF URL provided' });
// //   }

// //   if (!pdfUrl.match(/^https?:\/\//)) {
// //     console.error('Invalid PDF URL:', pdfUrl);
// //     return res.status(400).json({ error: 'Invalid PDF URL' });
// //   }

// //   try {
// //     console.log('Fetching PDF from:', pdfUrl);
// //     const response = await axios.get(pdfUrl, {
// //       responseType: 'arraybuffer',
// //       timeout: 15000,
// //       headers: {
// //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
// //       },
// //     });
// //     console.log('PDF fetched, size:', response.data.length, 'bytes');

// //     const pdfParser = new PDFParser();

// //     pdfParser.on('pdfParser_dataError', (errData) => {
// //       console.error('Error parsing PDF:', errData.parserError);
// //       res.status(500).json({
// //         error: 'Failed to parse PDF',
// //         details: errData.parserError,
// //       });
// //     });

// //     pdfParser.on('pdfParser_dataReady', (pdfData) => {
// //       try {
// //         const sentences = [];
// //         let currentSentence = [];
// //         let lastY = null;
// //         const yThreshold = 5; // Adjust based on PDF line spacing (in PDF units)
// //         const sentenceEndings = /[.!?]$/;

// //         pdfData.Pages.forEach((page, pageIndex) => {
// //           // Sort texts by y-coordinate (top to bottom), then x-coordinate (left to right)
// //           const texts = page.Texts.sort((a, b) => {
// //             const yDiff = a.y - b.y;
// //             if (Math.abs(yDiff) > yThreshold) return yDiff; // Different lines
// //             return a.x - b.x; // Same line, sort by x
// //           });

// //           texts.forEach((text, index) => {
// //             try {
// //               // Decode and clean text
// //               let decoded = decodeURIComponent(text.R[0].T).trim();
// //               decoded = decoded.replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
// //               if (!decoded || decoded.length <= 1) return; // Skip empty or single-character lines

// //               // Check if text is on a new line based on y-coordinate
// //               const isNewLine = lastY !== null && Math.abs(text.y - lastY) > yThreshold;

// //               // Add text to current sentence
// //               currentSentence.push(decoded);

// //               // Check if the text ends with sentence-ending punctuation
// //               const isSentenceEnd = sentenceEndings.test(decoded);

// //               // If it's a sentence end or a new line, finalize the current sentence
// //               if (isSentenceEnd || isNewLine || index === texts.length - 1) {
// //                 if (currentSentence.length > 0) {
// //                   const sentence = currentSentence.join(' ').trim();
// //                   if (sentence.length > 1) {
// //                     sentences.push(sentence);
// //                   }
// //                   currentSentence = isSentenceEnd ? [] : [decoded]; // Start new sentence if ended
// //                 }
// //               }

// //               lastY = text.y; // Update last y-coordinate
// //             } catch (e) {
// //               console.warn('Failed to decode text:', text.R[0].T);
// //               // Fallback: add raw text if decoding fails
// //               const rawText = text.R[0].T.trim();
// //               if (rawText.length > 1) {
// //                 currentSentence.push(rawText);
// //               }
// //             }
// //           });

// //           // Finalize any remaining sentence for the page
// //           if (currentSentence.length > 0) {
// //             const sentence = currentSentence.join(' ').trim();
// //             if (sentence.length > 1) {
// //               sentences.push(sentence);
// //             }
// //             currentSentence = [];
// //             lastY = null; // Reset for next page
// //           }
// //         });

// //         console.log('Parsed PDF sentences (first 20):', sentences.slice(0, 20));
// //         res.json({ sentences });
// //       } catch (error) {
// //         console.error('Error processing parsed PDF data:', error.message);
// //         res.status(500).json({
// //           error: 'Failed to process parsed PDF data',
// //           details: error.message,
// //         });
// //       }
// //     });

// //     pdfParser.parseBuffer(response.data);
// //   } catch (error) {
// //     console.error('Error fetching PDF:', error.message, error.response?.status || '');
// //     res.status(500).json({
// //       error: 'Failed to fetch PDF',
// //       details: error.response
// //         ? `Server responded with status ${error.response.status}: ${error.message}`
// //         : error.request
// //         ? 'No response received'
// //         : error.message,
// //       status: error.response?.status,
// //     });
// //   }
// // });




// const PORT = process.env.PORT || 3001;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import PDFParser from 'pdf2json';
import cors from 'cors';
import OpenAI from 'openai';

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: 'api_key'
});

// Enable CORS for the frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

// Create HTTP server and integrate with Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
});

// Socket.IO room management
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    try {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { viewers: new Set(), streamer: null });
      }
      const room = rooms.get(roomId);

      const isStreamer = socket.handshake.headers.referer?.includes('/stream/');
      if (isStreamer) {
        room.streamer = socket.id;
      } else {
        room.viewers.add(socket.id);
      }

      io.to(roomId).emit('room-update', {
        viewerCount: room.viewers.size,
        hasStreamer: !!room.streamer,
      });
    } catch (error) {
      console.error('Error in join-room:', error);
    }
  });

  socket.on('stream-video', (data) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      if (roomId) {
        console.log(`Broadcasting stream to room ${roomId}. Data size: ${data.length}`);
        socket.to(roomId).emit('receive-stream', data);
      }
    } catch (error) {
      console.error('Error in stream-video:', error);
    }
  });

  socket.on('leave-room', () => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          if (room.streamer === socket.id) {
            room.streamer = null;
          } else {
            room.viewers.delete(socket.id);
          }
          io.to(roomId).emit('room-update', {
            viewerCount: room.viewers.size,
            hasStreamer: !!room.streamer,
          });
        }
      }
    } catch (error) {
      console.error('Error in leave-room:', error);
    }
  });

  socket.on('disconnect', () => {
    try {
      rooms.forEach((room, roomId) => {
        if (room.streamer === socket.id) {
          room.streamer = null;
        } else {
          room.viewers.delete(socket.id);
        }
        io.to(roomId).emit('room-update', {
          viewerCount: room.viewers.size,
          hasStreamer: !!room.streamer,
        });
      });
      console.log('User disconnected:', socket.id);
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });
});

// PDF parsing endpoint


// app.post('/pdf', async (req, res) => {
//   const { pdfUrl } = req.body;
//   console.log('Received PDF URL:', pdfUrl);

//   if (!pdfUrl) {
//     console.error('No PDF URL provided');
//     return res.status(400).json({ error: 'No PDF URL provided' });
//   }

//   if (!pdfUrl.match(/^https?:\/\//)) {
//     console.error('Invalid PDF URL:', pdfUrl);
//     return res.status(400).json({ error: 'Invalid PDF URL' });
//   }

//   try {
//     console.log('Fetching PDF from:', pdfUrl);
//     const response = await axios.get(pdfUrl, {
//       responseType: 'arraybuffer',
//       timeout: 15000,
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//       },
//     });
//     console.log('PDF fetched, size:', response.data.length, 'bytes');

//     const pdfParser = new PDFParser();

//     pdfParser.on('pdfParser_dataError', (errData) => {
//       console.error('Error parsing PDF:', errData.parserError);
//       res.status(500).json({
//         error: 'Failed to parse PDF',
//         details: errData.parserError,
//       });
//     });

//     pdfParser.on('pdfParser_dataReady', (pdfData) => {
//       try {
//         const lines = [];
//         pdfData.Pages.forEach((page) => {
//           const pageLines = page.Texts.map((text) => {
//             try {
//               // Decode and clean text
//               let decoded = decodeURIComponent(text.R[0].T).trim();
//               // Remove extra spaces and control characters
//               decoded = decoded.replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
//               return decoded;
//             } catch (e) {
//               console.warn('Failed to decode text:', text.R[0].T);
//               return text.R[0].T.trim();
//             }
//           }).filter((line) => line && line.length > 1); // Filter out empty or single-character lines
//           lines.push(...pageLines);
//         });

//         console.log('Parsed PDF lines (first 20):', lines.slice(0, 20));
//         res.json({ lines });
//       } catch (error) {
//         console.error('Error processing parsed PDF data:', error.message);
//         res.status(500).json({
//           error: 'Failed to process parsed PDF data',
//           details: error.message,
//         });
//       }
//     });

//     pdfParser.parseBuffer(response.data);
//   } catch (error) {
//     console.error('Error fetching PDF:', error.message, error.response?.status || '');
//     res.status(500).json({
//       error: 'Failed to fetch PDF',
//       details: error.response
//         ? `Server responded with status ${error.response.status}: ${error.message}`
//         : error.request
//         ? 'No response received'
//         : error.message,
//       status: error.response?.status,
//     });
//   }
// });

app.post('/pdf', async (req, res) => {
  const { pdfUrl } = req.body;
  console.log('Received PDF URL:', pdfUrl);

  if (!pdfUrl) {
    console.error('No PDF URL provided');
    return res.status(400).json({ error: 'No PDF URL provided' });
  }

  if (!pdfUrl.match(/^https?:\/\//)) {
    console.error('Invalid PDF URL:', pdfUrl);
    return res.status(400).json({ error: 'Invalid PDF URL' });
  }

  try {
    console.log('Fetching PDF from:', pdfUrl);
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 600000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    console.log('PDF fetched, size:', response.data.length, 'bytes');

    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData) => {
      console.error('Error parsing PDF:', errData.parserError);
      res.status(500).json({
        error: 'Failed to parse PDF',
        details: errData.parserError,
      });
    });

    pdfParser.on('pdfParser_dataReady', async (pdfData) => {
      try {
        // Extract text lines from PDF
        const lines = [];
        pdfData.Pages.forEach((page) => {
          const pageLines = page.Texts.map((text) => {
            try {
              let decoded = decodeURIComponent(text.R[0].T).trim();
              decoded = decoded.replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
              return decoded;
            } catch (e) {
              console.warn('Failed to decode text:', text.R[0].T);
              return text.R[0].T.trim();
            }
          }).filter((line) => line && line.length > 1);
          lines.push(...pageLines);
        });
        console.log('Parsed PDF lines (first 20):', lines.slice(0, 20));

        // Structure data using OpenAI
        const prompt = `
          You are an expert at extracting structured data from exam documents. Given the following text extracted from an exam PDF, return a JSON object with two main fields:
          - "instructions": An object with "title" (e.g., institute name or exam title) and "content" (an array of instruction lines, excluding metadata like exam date or course code).
          - "questions": An array of question objects, each with "id" (e.g., Qtn1), "text" (question text), "type" (multiple-choice, short-answer, or essay based on marks or options), "options" (array of options for multiple-choice, if any), "subparts" (array of subpart objects with id and text, if any), and "section" (section identifier like A, B, or null if no sections).

          Rules:
          - Identify instructions as the initial text before questions, excluding metadata (e.g., Exam Date, Course Code).
          - Detect sections (e.g., Section A, Part B) and assign questions to them.
          - Identify questions by markers like "Qtn1", "Question 1", "1.", or "Question One:".
          - Subparts are marked like "a)", "b)", etc.
          - Options for multiple-choice are marked like "a.", "b.", etc.
          - Infer question type: multiple-choice (has options), short-answer (1-5 marks), essay (>5 marks or no options).
          - Ignore footers (e.g., "Page 1 of 2", "©").
          - If no sections are present, set section to null.

          Input text:
          ${lines.join('\n')}

          Output format:
          {
            "instructions": {
              "title": string,
              "content": string[]
            },
            "questions": [
              {
                "id": string,
                "text": string,
                "type": "multiple-choice" | "short-answer" | "essay",
                "options"?: string[],
                "subparts"?: { "id": string, "text": string }[],
                "section"?: string | null
              }
            ]
          }
        `;

        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-4', // or 'gpt-3.5-turbo' for cost efficiency
          messages: [
            { role: 'system', content: 'You are a data extraction assistant.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.2,
        });

        const structuredData = JSON.parse(aiResponse.choices[0].message.content);
        console.log('Structured data:', structuredData);

        res.json(structuredData);
      } catch (error) {
        console.error('Error processing parsed PDF data or AI response:', error.message);
        res.status(500).json({
          error: 'Failed to process PDF or AI response',
          details: error.message,
        });
      }
    });

    pdfParser.parseBuffer(response.data);
  } catch (error) {
    console.error('Error fetching PDF:', error.message, error.response?.status || '');
    res.status(500).json({
      error: 'Failed to fetch PDF',
      details: error.response
        ? `Server responded with status ${error.response.status}: ${error.message}`
        : error.request
        ? 'No response received'
        : error.message,
      status: error.response?.status,
    });
  }
});

// app.post('/pdf', async (req, res) => {
//   const { pdfUrl } = req.body;
//   console.log('Received PDF URL:', pdfUrl);

//   if (!pdfUrl) {
//     console.error('No PDF URL provided');
//     return res.status(400).json({ error: 'No PDF URL provided' });
//   }

//   if (!pdfUrl.match(/^https?:\/\//)) {
//     console.error('Invalid PDF URL:', pdfUrl);
//     return res.status(400).json({ error: 'Invalid PDF URL' });
//   }

//   try {
//     console.log('Fetching PDF from:', pdfUrl);
//     const response = await axios.get(pdfUrl, {
//       responseType: 'arraybuffer',
//       timeout: 15000,
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//       },
//     });
//     console.log('PDF fetched, size:', response.data.length, 'bytes');

//     const pdfParser = new PDFParser();

//     pdfParser.on('pdfParser_dataError', (errData) => {
//       console.error('Error parsing PDF:', errData.parserError);
//       res.status(500).json({
//         error: 'Failed to parse PDF',
//         details: errData.parserError,
//       });
//     });

//     pdfParser.on('pdfParser_dataReady', (pdfData) => {
//       try {
//         const sentences = [];
//         let currentSentence = [];
//         let lastY = null;
//         const yThreshold = 5; // Adjust based on PDF line spacing (in PDF units)
//         const sentenceEndings = /[.!?]$/;

//         pdfData.Pages.forEach((page, pageIndex) => {
//           // Sort texts by y-coordinate (top to bottom), then x-coordinate (left to right)
//           const texts = page.Texts.sort((a, b) => {
//             const yDiff = a.y - b.y;
//             if (Math.abs(yDiff) > yThreshold) return yDiff; // Different lines
//             return a.x - b.x; // Same line, sort by x
//           });

//           texts.forEach((text, index) => {
//             try {
//               // Decode and clean text
//               let decoded = decodeURIComponent(text.R[0].T).trim();
//               decoded = decoded.replace(/\s+/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
//               if (!decoded || decoded.length <= 1) return; // Skip empty or single-character lines

//               // Check if text is on a new line based on y-coordinate
//               const isNewLine = lastY !== null && Math.abs(text.y - lastY) > yThreshold;

//               // Add text to current sentence
//               currentSentence.push(decoded);

//               // Check if the text ends with sentence-ending punctuation
//               const isSentenceEnd = sentenceEndings.test(decoded);

//               // If it's a sentence end or a new line, finalize the current sentence
//               if (isSentenceEnd || isNewLine || index === texts.length - 1) {
//                 if (currentSentence.length > 0) {
//                   const sentence = currentSentence.join(' ').trim();
//                   if (sentence.length > 1) {
//                     sentences.push(sentence);
//                   }
//                   currentSentence = isSentenceEnd ? [] : [decoded]; // Start new sentence if ended
//                 }
//               }

//               lastY = text.y; // Update last y-coordinate
//             } catch (e) {
//               console.warn('Failed to decode text:', text.R[0].T);
//               // Fallback: add raw text if decoding fails
//               const rawText = text.R[0].T.trim();
//               if (rawText.length > 1) {
//                 currentSentence.push(rawText);
//               }
//             }
//           });

//           // Finalize any remaining sentence for the page
//           if (currentSentence.length > 0) {
//             const sentence = currentSentence.join(' ').trim();
//             if (sentence.length > 1) {
//               sentences.push(sentence);
//             }
//             currentSentence = [];
//             lastY = null; // Reset for next page
//           }
//         });

//         console.log('Parsed PDF sentences (first 20):', sentences.slice(0, 20));
//         res.json({ sentences });
//       } catch (error) {
//         console.error('Error processing parsed PDF data:', error.message);
//         res.status(500).json({
//           error: 'Failed to process parsed PDF data',
//           details: error.message,
//         });
//       }
//     });

//     pdfParser.parseBuffer(response.data);
//   } catch (error) {
//     console.error('Error fetching PDF:', error.message, error.response?.status || '');
//     res.status(500).json({
//       error: 'Failed to fetch PDF',
//       details: error.response
//         ? `Server responded with status ${error.response.status}: ${error.message}`
//         : error.request
//         ? 'No response received'
//         : error.message,
//       status: error.response?.status,
//     });
//   }
// });




const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});