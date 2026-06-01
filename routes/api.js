const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Registrar usuario
router.post('/registro', async (req, res) => {
    const { cedula } = req.body;
    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ cedula }]);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ ok: true });
});

// Login
router.post('/login', async (req, res) => {
    const { cedula } = req.body;
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('cedula', cedula)
        .single();
    if (error || !data) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ ok: true, usuario: data });
});

// Guardar resultado
router.post('/resultado', async (req, res) => {
    const { cedula, modo, clima, puntaje, calificacion, angulo, maniobras } = req.body;
    const { data, error } = await supabase
        .from('resultados')
        .insert([{ cedula, modo, clima, puntaje, calificacion, angulo, maniobras }]);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ ok: true });
});

// Obtener resultados de un usuario
router.get('/resultados/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { data, error } = await supabase
        .from('resultados')
        .select('*')
        .eq('cedula', cedula)
        .order('fecha', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;
