function respondError(res, error, context) {
  // 1) Validation Mongoose (POST/PUT avec un corps invalide)
  if (error && error.name === "ValidationError") {
    const messages = Object.values(error.errors || {}).map((e) => e.message);
    return res.status(400).json({
      message: messages.join(" ") || "Invalid data."
    });
  }

  // 2) Cast Mongoose (id mal formé, ObjectId invalide)
  if (error && error.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifiers." });
  }

  // 3) Erreurs métier levées par les services
  if (error && (
        error.name === "InvalidParameters" ||
        error.name === "MissingField"     ||
        error.name === "StateConflict"
      )) {
    return res.status(400).json({ message: error.message });
  }

  // 4) Conflit d'index unique (rare ici, mais bon réflexe)
  if (error && error.code === 11000) {
    return res.status(409).json({ message: "Conflit : valeur déjà existante." });
  }

  // 5) Cas non identifié -> 500 + log côté serveur uniquement
  console.error(`Error ${context || ""} :`, error);
  return res.status(500).json({ message: "Server error." });
}

module.exports = { respondError };
