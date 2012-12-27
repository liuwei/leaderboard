/**
 * Created with JetBrains WebStorm.
 * User: liuwei3
 * Date: 12-12-27
 * Time: 上午8:52
 * To change this template use File | Settings | File Templates.
 */
Meteor.startup(function () {
    if (Players.find().count() === 0) {
        var data = [
            {
                name: "cube",
                model: {
                    "vertices" : [
                        -0.5, 0.5, 0.5,
                        -0.5,-0.5, 0.5,
                        0.5,-0.5, 0.5,
                        0.5, 0.5, 0.5,
                        0.5,-0.5,-0.5,
                        0.5, 0.5,-0.5,
                        -0.5,-0.5,-0.5,
                        -0.5, 0.5, -0.5
                    ],
                    "indices"  : [
                        0,1,2,0,2,3,
                        3,2,4,3,4,5,
                        5,4,6,5,6,7,
                        0,3,7,7,3,5,
                        7,6,1,7,1,0,
                        1,6,4,1,4,2
                    ]
                }
            },
            {
                name: "cone",
                model: {
                    "vertices" : [
                        1.5, 0, 0,
                        -1.5, 1, 0,
                        -1.5, 0.809017, 0.587785,
                        -1.5, 0.309017, 0.951057,
                        -1.5, -0.309017, 0.951057,
                        -1.5, -0.809017, 0.587785,
                        -1.5, -1, 0,
                        -1.5, -0.809017, -0.587785,
                        -1.5, -0.309017, -0.951057,
                        -1.5, 0.309017, -0.951057,
                        -1.5, 0.809017, -0.587785
                    ],

                    "indices" : [
                        0, 1, 2,
                        0, 2, 3,
                        0, 3, 4,
                        0, 4, 5,
                        0, 5, 6,
                        0, 6, 7,
                        0, 7, 8,
                        0, 8, 9,
                        0, 9, 10,
                        0, 10, 1
                    ]
                }

            }
        ];

        for (var i = 0; i < data.length; i++)
            Players.insert({name:data[i].name, model:data[i].model});
    }
});