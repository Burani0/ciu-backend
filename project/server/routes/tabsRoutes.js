import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory store with persistence simulation
const activeTabsBySession = new Map();
const TAB_TIMEOUT = 10000; // Increased to 10s for robustness
let lastCleanup = Date.now();

function purgeExpired(sessionId) {
  const now = Date.now();
  const tabs = activeTabsBySession.get(sessionId) || new Map();
  let deleted = false;
  for (const [tabId, ts] of tabs.entries()) {
    if (now - ts > TAB_TIMEOUT) {
      tabs.delete(tabId);
      deleted = true;
      console.log(`[Backend] Purged expired tab ${tabId} for session ${sessionId}`);
    }
  }
  if (deleted) {
    activeTabsBySession.set(sessionId, tabs);
    console.log(`[Backend] Post-purge count for session ${sessionId}: ${tabs.size}`);
  }
  if (tabs.size === 0) {
    activeTabsBySession.delete(sessionId);
    console.log(`[Backend] Removed session ${sessionId} due to no active tabs`);
  }
  return tabs.size;
}

router.post('/register', (req, res) => {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }
    const tabId = uuidv4();
    let tabs = activeTabsBySession.get(sessionId) || new Map();
    tabs.set(tabId, Date.now());
    activeTabsBySession.set(sessionId, tabs);
    const count = purgeExpired(sessionId);
    console.log(`[Backend] Registered tab ${tabId} for session ${sessionId}. Initial count: ${count}`);
    return res.json({ tabId, count });
  } catch (err) {
    console.error('tabs/register error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

router.post('/heartbeat', (req, res) => {
  try {
    const { tabId, sessionId } = req.body || {};
    if (!tabId || !sessionId) {
      return res.status(400).json({ error: 'tabId and sessionId required' });
    }
    const tabs = activeTabsBySession.get(sessionId) || new Map();
    if (tabs.has(tabId)) {
      tabs.set(tabId, Date.now());
      activeTabsBySession.set(sessionId, tabs);
      const count = purgeExpired(sessionId);
      console.log(`[Backend] Heartbeat for tab ${tabId} in session ${sessionId}. Updated count: ${count}`);
      return res.sendStatus(204);
    }
    return res.status(404).json({ error: 'tabId not found' });
  } catch (err) {
    console.error('tabs/heartbeat error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

router.post('/unregister', (req, res) => {
  try {
    const { tabId, sessionId } = req.body || {};
    if (!tabId || !sessionId) {
      return res.status(400).json({ error: 'tabId and sessionId required' });
    }
    const tabs = activeTabsBySession.get(sessionId) || new Map();
    if (tabs.delete(tabId)) {
      activeTabsBySession.set(sessionId, tabs);
      const count = purgeExpired(sessionId);
      console.log(`[Backend] Unregistered tab ${tabId} from session ${sessionId}. Remaining count: ${count}`);
    } else {
      console.log(`[Backend] Attempted to unregister non-existent tab ${tabId} for session ${sessionId}`);
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error('tabs/unregister error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

router.get('/count', (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }
    const tabs = activeTabsBySession.get(sessionId) || new Map();
    const count = purgeExpired(sessionId);
    console.log(`[Backend] Count query for session ${sessionId}: ${count} (Active tabs: ${tabs.size})`);
    return res.json({ count });
  } catch (err) {
    console.error('tabs/count error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  if (now - lastCleanup > 5000) { // Cleanup every 5s
    for (const sessionId of activeTabsBySession.keys()) {
      const tabs = activeTabsBySession.get(sessionId) || new Map();
      let deleted = false;
      for (const [tabId, ts] of tabs.entries()) {
        if (now - ts > TAB_TIMEOUT) {
          tabs.delete(tabId);
          deleted = true;
          console.log(`[Backend] Periodic purge removed tab ${tabId} from session ${sessionId}`);
        }
      }
      if (deleted) {
        activeTabsBySession.set(sessionId, tabs);
        console.log(`[Backend] Periodic purge updated count for session ${sessionId}: ${tabs.size}`);
      }
      if (tabs.size === 0) {
        activeTabsBySession.delete(sessionId);
        console.log(`[Backend] Periodic cleanup removed session ${sessionId}`);
      }
    }
    lastCleanup = now;
  }
}, 1000);

export default router;