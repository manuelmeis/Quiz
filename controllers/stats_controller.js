var models = require('../models/models.js');

//Calcula las estadisticas
exports.results = function(req, res, next){

	var stats = {
		totalPreguntas:0,
		totalComentarios:0,
		preguntasComentadas:0,
		preguntasNoComentadas:0
	};
	//total de preguntas
	models.Quiz.count().then(function(countp){
		stats.totalPreguntas = countp;

		//Total comentarios
		models.Comment.count().then(function(countc){
			stats.totalComentarios = countc;
			stats.promedioComentarios = stats.totalComentarios / stats.totalPreguntas;

			//Preguntas con comentarios
			models.sequelize.query('SELECT COUNT(DISTINCT "QuizId" ) as num from "Comments"')
			.then(function(results){

				stats.preguntasComentadas = results[0].num;
				stats.preguntasNoComentadas = stats.totalPreguntas - stats.preguntasComentadas;

				res.render('stats/show.ejs', {stats:stats, errors: []});
			});
			/*models.Comment.count({ distinct: 'QuizId', order: 'QuizId', fields:'QuizId' }).then(function(dist){
				stats.preguntasComentadas=dist;
				stats.preguntasNoComentadas=stats.totalPreguntas-stats.preguntasComentadas;
				res.render('stats/show.ejs', {stats:stats, errors: []});
			});*/
			//console.log('Total preguntas: ' + stats.totalPreguntas);
			//console.log('Total Comentarios: ' + stats.totalComentarios);
		});
	});
	return;
};
