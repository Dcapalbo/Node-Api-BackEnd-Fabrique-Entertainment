/** @format */

const { validationResult } = require('express-validator')
const { deleteFile } = require('../util/functions')
const Film = require('../model/film')
const {
  uploadFile,
  getImageUrlFromS3,
  deleteImageFromS3,
  getImageKeysFromEntity,
} = require('../s3Config')
const film = require('../model/film')

// GET => Getting all films
exports.getFilms = async (req, res) => {
  try {
    const films = await Film.find().sort({ year: -1 })
    const filmsWithImages = await Promise.all(
      films.map(async (film) => {
        let coverImageUrl, pressBookPdfUrl

        if (film.coverImageKey) {
          coverImageUrl = await getImageUrlFromS3(film.coverImageKey)
        }

        if (film.pressBookPdfKey) {
          pressBookPdfUrl = await getImageUrlFromS3(film.pressBookPdfKey)
        }

        return {
          ...film.toObject(),
          cover: {
            coverImageUrl,
            coverImageKey: film.coverImageKey,
          },
          pressBook: {
            pressBookPdfUrl,
            pressBookPdfKey: film.pressBookPdfKey,
          },
        }
      }),
    )

    return res.status(200).send(filmsWithImages ? filmsWithImages : films)
  } catch (error) {
    return res.status(404).json({ message: 'Films was not found', error })
  }
}
// POST => Adding a Film
exports.addFilm = async (req, res) => {
  const {
    title,
    director,
    productions,
    producers,
    coProductions,
    coProducers,
    collaborations,
    contributes,
    actors,
    subjects,
    screenwriters,
    genre,
    projectState,
    directorOfPhotography,
    editing,
    scenography,
    costumes,
    musics,
    sound,
    soundDesign,
    casting,
    lineProducer,
    executiveProducers,
    distributor,
    salesAgent,
    firstAssistantDirector,
    synopsis,
    productionNotes,
    directorNotes,
    duration,
    year,
    festivals,
    slug,
    type,
    trailer,
    imdb,
    instagram,
    facebook,
  } = req.body

  const errors = validationResult(req)
  // if there are errors
  // Send a response with the status and a json
  if (!errors.isEmpty()) {
    res.status(422).json({
      film: {
        title,
        director,
        productions,
        producers,
        coProductions: coProductions ?? null,
        coProducers: coProducers ?? null,
        collaborations: collaborations ?? null,
        contributes: contributes ?? null,
        actors,
        subjects,
        screenwriters,
        genre,
        projectState: projectState ?? null,
        directorOfPhotography,
        editing,
        scenography: scenography ?? null,
        costumes: costumes ?? null,
        musics,
        sound: sound ?? null,
        soundDesign: soundDesign ?? null,
        casting: casting ?? null,
        lineProducer: lineProducer ?? null,
        executiveProducers,
        distributor: distributor ?? null,
        salesAgent: salesAgent ?? null,
        firstAssistantDirector: firstAssistantDirector ?? null,
        synopsis,
        productionNotes: productionNotes ?? null,
        directorNotes: directorNotes ?? null,
        duration,
        year,
        festivals: festivals ?? null,
        slug,
        type,
        trailer: trailer ?? null,
        imdb: imdb ?? null,
        instagram: instagram ?? null,
        facebook: facebook ?? null,
      },
      message: 'Validation errors are present',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

  // saving the data inside the db and the images on s3
  try {
    const existingFilm = await Film.findOne({ title })
    if (existingFilm) {
      return res.status(400).json({ message: 'The film exist already' })
    }

    const cover = req.files.find((file) => file.fieldname === 'coverImage')
    const coverImageKey = `films/${title}/cover/${cover.originalname}`

    await uploadFile(cover, coverImageKey)

    let pressBook, pressBookPdfKey

    if (req.files.find((file) => file.fieldname === 'pressBookPdf')) {
      pressBook = req.files.find((file) => file.fieldname === 'pressBookPdf')
      pressBookPdfKey = `films/${title}/pressbook/${pressBook.originalname}`
      await uploadFile(pressBook, pressBookPdfKey)
    }

    const film = await Film.create({
      title,
      director,
      productions,
      producers,
      coProductions: coProductions ?? null,
      coProducers: coProducers ?? null,
      collaborations: collaborations ?? null,
      contributes: contributes ?? null,
      actors,
      subjects,
      screenwriters,
      genre,
      projectState: projectState ?? null,
      directorOfPhotography,
      editing,
      scenography: scenography ?? null,
      costumes: costumes ?? null,
      musics,
      sound: sound ?? null,
      soundDesign: soundDesign ?? null,
      casting: casting ?? null,
      lineProducer: lineProducer ?? null,
      executiveProducers,
      distributor: distributor ?? null,
      salesAgent: salesAgent ?? null,
      firstAssistantDirector: firstAssistantDirector ?? null,
      synopsis,
      productionNotes: productionNotes ?? null,
      directorNotes: directorNotes ?? null,
      duration,
      year,
      festivals: festivals ?? null,
      slug,
      type,
      trailer: trailer ?? null,
      imdb: imdb ?? null,
      instagram: instagram ?? null,
      facebook: facebook ?? null,
      coverImageKey,
      pressBookPdfKey,
    })

    deleteFile('images/' + cover.filename)

    if (pressBook) {
      deleteFile('images/' + pressBook.filename)
    }

    return res.status(201).send(film)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error })
  }
}

// Assumiamo che 'validationResult' da 'express-validator'
// e le funzioni 'uploadFile' e 'deleteFile' siano importate altrove.

// PUT => Modifica di un film
exports.editFilm = async (req, res) => {
  const uploadedFiles = []

  try {
    // 1. Validazione prima di tutto
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Ritorna 422 (Unprocessable Entity) con gli errori
      return res.status(422).json({
        message: 'Sono presenti errori di validazione.',
        errors: errors.array(),
      })
    }

    // 2. Estrai l'ID e costruisci l'oggetto di aggiornamento
    const { _id, title } = req.body

    if (!_id) {
      // 400 (Bad Request) è più appropriato di 404 se l'ID manca nella richiesta
      return res.status(400).json({
        message: "Impossibile aggiornare il film, l'ID è mancante.",
      })
    }

    const updateData = { ...req.body }

    // Rimuovi _id dall'oggetto di aggiornamento, non vogliamo aggiornare l'ID stesso
    delete updateData._id

    // 3. Gestione Caricamento File (più pulita)

    // --- Gestione Cover Image ---
    const newCoverFile = req.files?.find(
      (file) => file.fieldname === 'coverImage',
    )

    if (newCoverFile) {
      // Un nuovo file è stato caricato
      const coverImageKey = `films/${title || 'unknown'}/cover/${
        newCoverFile.originalname
      }`
      await uploadFile(newCoverFile, coverImageKey)
      updateData.coverImageKey = coverImageKey
      uploadedFiles.push(newCoverFile)
      delete updateData.coverImage
    } else if (req.body.coverImage) {
      updateData.coverImageKey = req.body.coverImage
      delete updateData.coverImage
    }

    // --- Gestione Press Book ---
    const newPressBookFile = req.files?.find(
      (file) => file.fieldname === 'pressBookPdf',
    )

    if (newPressBookFile) {
      const pressBookPdfKey = `films/${title || 'unknown'}/pressbook/${
        newPressBookFile.originalname
      }`
      await uploadFile(newPressBookFile, pressBookPdfKey)
      updateData.pressBookPdfKey = pressBookPdfKey
      uploadedFiles.push(newPressBookFile)
      delete updateData.pressBook
      delete updateData.pressBookPdf
    } else if (req.body.pressBook) {
      updateData.pressBookPdfKey = req.body.pressBook
      delete updateData.pressBook
      delete updateData.pressBookPdf
    }

    // 4. Esegui l'aggiornamento sul Database
    const updatedFilm = await Film.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedFilm) {
      return res.status(404).json({
        message: "Film non trovato con l'ID fornito.",
      })
    }

    // 5. Risposta di successo
    res.status(200).json(updatedFilm)
  } catch (error) {
    console.error("Errore durante l'aggiornamento del film:", error)
    res.status(500).json({
      message: "Errore interno del server durante l'aggiornamento del film.",
    })
  } finally {
    for (const file of uploadedFiles) {
      try {
        deleteFile('images/' + file.filename)
      } catch (cleanupError) {
        console.error(
          `Impossibile eliminare il file temporaneo ${file.filename}:`,
          cleanupError,
        )
      }
    }
  }
}

//DELETE => Delete a single film using the film id and the s3 images correlated to it
exports.deleteFilm = async (req, res) => {
  const filmId = req.body._id

  try {
    const film = await Film.findById(filmId)

    if (!film) {
      return res.status(404).json({ message: 'Film not found' })
    }

    const imageKeys = getImageKeysFromEntity(film)
    const deletePromises = imageKeys.map((imageKey) =>
      deleteImageFromS3(imageKey),
    )

    await Promise.all(deletePromises)
    await Film.findByIdAndRemove(filmId)

    return res.status(200).json({
      message: 'The film and its associated images has been deleted',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while deleting a film:',
      error,
    })
  }
}
//DELETE IMAGE => delete one specific image attached to the film from s3
exports.deleteImage = async (req, res) => {
  const imageKey = req.query.image_key

  try {
    const deleteResult = await deleteImageFromS3(imageKey)
    const film = await Film.findOne({
      $or: [{ coverImageKey: imageKey }, { pressBookPdfKey: imageKey }],
    })

    if (!film) {
      return res.status(404).json({ message: 'Film not found' })
    }

    if (film.coverImageKey === imageKey) {
      film.coverImageKey = null
    }
    if (film.pressBookPdfKey === imageKey) {
      film.pressBookPdfKey = null
    }

    await film.save()

    res.json({ message: 'Image deleted from S3 successfully', deleteResult })
  } catch (error) {
    console.error('Error deleting image from S3:', error)
    res.status(500).json({ message: 'Error deleting image from S3.', error })
  }
}
