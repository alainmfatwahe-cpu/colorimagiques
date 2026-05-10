    const result = await db('products').select('id','title','theme').orderBy('id');
    res.json({ success: true, count: result.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;