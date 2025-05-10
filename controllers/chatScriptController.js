const ChatScript = require('../models/chatScriptSchema');

// Create new script
exports.createScript = async (req, res) => {
  try {
    const { provider, key } = req.body;

    const exists = await ChatScript.findOne();
    if (exists) return res.status(400).json({ message: "Script already exists. Use update instead." });

    const newScript = await ChatScript.create({ provider, key });
    res.status(201).json(newScript);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current script
exports.getScript = async (req, res) => {
  try {
    const script = await ChatScript.findOne();
    if (!script) return res.status(404).json({ message: "No script found." });
    res.json(script);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update script
exports.updateScript = async (req, res) => {
  try {
    const { provider, key } = req.body;
    const script = await ChatScript.findOne();
    if (!script) return res.status(404).json({ message: "Script not found." });

    script.provider = provider || script.provider;
    script.key = key || script.key;
    await script.save();
    res.json(script);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle activation
exports.toggleScript = async (req, res) => {
  try {
    const script = await ChatScript.findOne();
    if (!script) return res.status(404).json({ message: "Script not found." });

    script.active = !script.active;
    await script.save();
    res.json({ active: script.active });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete script
exports.deleteScript = async (req, res) => {
  try {
    const deleted = await ChatScript.findOneAndDelete();
    if (!deleted) return res.status(404).json({ message: "No script to delete." });
    res.json({ message: "Script deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Serve script to frontend
exports.serveScript = async (req, res) => {
  try {
    const script = await ChatScript.findOne();
    if (!script || !script.active) return res.sendStatus(204);

    let scriptText = "";
    if (script.provider === 'smartsupp') {
      scriptText = `
        var _smartsupp = _smartsupp || {};
        _smartsupp.key = '${script.key}';
        window.smartsupp||(function(d) {
          var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
          s=d.getElementsByTagName('script')[0];c=d.createElement('script');
          c.type='text/javascript';c.charset='utf-8';c.async=true;
          c.src='https://www.smartsuppchat.com/loader.js?';
          s.parentNode.insertBefore(c,s);
        })(document);
      `;
    } else if (script.provider === 'tawkto') {
      scriptText = `
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/${script.key}/default';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
        })();
      `;
    }

    res.type('text/javascript').send(scriptText);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
