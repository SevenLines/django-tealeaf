/**
 * Created by m on 11.02.15.
 */
requirejs.config({
    paths: {
        //marks: '../marks',
        lesson: './marks/lesson',
        mark: './marks/mark',
        markselector: './marks/markselector',
        student: './marks/student',
        discipline: './marks/discipline',
        knockout: '../../bower_components/knockout/dist/knockout'
    }
});


// >>> DATE FORMATING
Date.prototype.ddmmyyyy = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return (dd[1] ? dd : "0" + dd[0]) + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + yyyy;
};

requirejs(['marks/main']);