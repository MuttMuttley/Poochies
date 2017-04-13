
 
            $(function(){

                var pathToImages="images/dogPics/";

                var dogImages=["jackRussel.png","poodle2.png","cat.png", 
                                "jumpingWhiteDog.png" ,"chiwawa.png",
                                 "bassetHound.png","happyDog.png",
                                 "airdaleTerrior.png","exitedDog1.png",
                                 "japaneseDog.png","smallDog.png",
                                 "proudDog.png"
                                 ];
               /* var dogNames=["Percival","Henrietta","Muttley", "Skippy",
                                "Harold","Barney","Buster","Biscuit",
                                "Tony","Aki","Tea Cup","Lucy"

                ];*/

                 var dogNames=[{name:"Percival",isUsed:false},
                               {name:"Henrietta", isUsed:false},
                               {name:"Muttley", isUsed:false},
                               {name:"Skippy",isUsed: false},
                               {name:"Harold", isUsed: false},
                               {name:"Barney", isUsed:false},
                               {name:"Magnus", isUsed:false},
                               {name:"Biscuit",isUsed:false},
                               {name:"Tony",isUsed:false},
                               {name:"Aki",isUsed:false},
                               {name:"Tea Cup",isUsed:false},
                               {name:"Lucy", isUsed:false}

                ];

                Array.prototype.swapDogs = function(index1,index2){
                    //swap dogs
                    var temp = this[index1];
                    this[index1] = this[index2];
                    this[index2] = temp;
                    //swap ID's
                    var tempID = this[index1].id;
                    this[index1].id= this[index2].id;
                    this[index2].id = tempID;
                    return this;
                }

                Array.prototype.mostClicks= function(){
                    var mostclicks;
                    var dogID=-1;
                    if(this.length > 0){
                        mostclicks= this[0].votes;
                        dogID = this[0].id;
                        for(var i= 0; i< this.length; i++)
                            if(this[i].votes > mostclicks){
                                mostclicks = this[i].votes;
                                dogID = this[i].id;
                            }
                                
                    }
                    return mostclicks;
                }

                var model={
                    lastID: 0,
                    dogs: [],
                    currentProfileID: 0
                    
                };

                var octopus={                  
                    addDog: function(){
                        
                        //To work on renumbering ids
                        var thisID= model.dogs.length+1;
                        
                        var renderType = "";
                        if(thisID > dogNames.length){
                            renderType = -1;
                        }
                        else{
                             var thisPic= ++model.lastID;
                             //for new system with limited dog #
                             var i=0;
                             while(dogNames[(thisID-1+i)%(dogNames.length)].isUsed){
                                 i++;
                             }
                             var index=thisID-1+i;
                            var dogName=dogNames[index%(dogNames.length)].name;
                            dogNames[index%(dogNames.length)].isUsed=true;
                            var dogImage= dogImages[index%(dogImages.length)];
                        //var thisID= model.dogs.length;
                            //var dogImage= dogImages[(thisPic-1)%(dogImages.length)];                    
                            //var dogName=dogNames[(thisPic-1)%(dogNames.length)].name;
                        //alert("new dog ID= " + thisID);
                            var dogImageFull=pathToImages.concat(dogImage);
                        //alert("full image path= "+ dogImageFull);
                             model.dogs.push({
                                id: thisID,
                                name: dogName,
                                image: dogImageFull,
                                votes: 0,
                            });          
                            model.currentProfileID = thisID;
                            renderType=thisID;
                        }
                        view.renderProfile(renderType);
                        //alert("back in dog add after clear renderProfile");
                        view.renderNames();                        
                    },

                    removeDog: function(dog){
                        //alert("in remove dog, dog.id= "+ dog.id);
                        //new system with limited dog #
                        var dogImage = model.dogs[dog.id-1].image.replace(pathToImages,'');
                        var index = dogImages.indexOf(dogImage);
                        //alert("in remove index of image= "+ index);
                        dogNames[index].isUsed=false;

                        if(model.dogs.length > 1){
                            model.dogs.swapDogs(dog.id-1,model.dogs.length-1);
                            alert();
                        }
                            //model.dogs.splice(dog.id-1,1);
                            //else
                        model.dogs.pop();
                        //alert("array length after remove= "+ model.dogs.length);
                        view.renderProfile();
                        //alert("back in dog remove after clear renderProfile");
                        view.renderNames();
                    },

                    init: function(){
                        view.init();
                    },

                    setCurrentProfileID: function (dogID){
                        model.currentProfileID=dogID;
                    },

                    getCurrentProfileID: function (){
                        return model.currentProfileID;
                    },

                    dogProfile: function(dogID){
                        //alert("in dogProfile dogID= "+dogID);
                        
                        view.renderProfile(dogID);
                    },

                    addVote: function(){
                        var dogID= this.getCurrentProfileID();
                        
                        //alert("in addVote currentId= "+ dogID);
                        var no_votes = model.dogs[dogID-1].votes++;
                        //alert("number of votes= "+ model.dogs[dogID-1].votes);
                        //view.refreshDiv();
                        //alert("in add votes dogId= "+ dogID + "no votes= "+ no_votes);
                        view.renderProfile(dogID);
                    },

                    getMostClicks: function(){
                      /*  var dogID = model.dogs.mostClicks();
                        if(dogID > -1)
                            view.renderProfile(dogID);
                            */
                        var mostclicks=model.dogs.mostClicks();
                        function hasMostClicks(dogs){
                            return (dogs.votes == mostclicks);
                        }
                        var topDogs = model.dogs.filter(hasMostClicks);
                        //return model.dogs.filter(mostclicks);
                        view.renderProfiles(topDogs);
                    },

                    resetClicks: function(){
                        for(var i=0; i< model.dogs.length; i++){
                            model.dogs[i].votes=0;
                        }
                        view.renderProfile();
                    },

                    instructions: function(){
                        view.renderProfile();
                        view.renderWelcome(true);
                    }
                 
                };

                var view={

                   
                    init: function(){

                      //add listener to add dogs  
                        var addDogBtn=$('.add-dog');
                        addDogBtn.click(   
                            function(){
                                octopus.addDog();
                            
                        });
                        
                        var topDogBtn=$('.top-dog');
                        topDogBtn.click(
                            function(){
                                octopus.getMostClicks();
                            }
                        );

                        var resetClicksBtn=$('.reset-clicks');
                        resetClicksBtn.click(
                            function(){
                                octopus.resetClicks();
                            }
                        );

                        var instructionsBtn=$('.instructions');
                        instructionsBtn.click(
                            function(){
                                octopus.instructions();
                            }
                        );
     
                        this.$dogList=$('.dog-list');
                        this.dogListTemplate=$('script[data-template="names"]').html();

                        this.$welcome=$('.welcome');

                        this.$footer=$('.footer');

                        //add listener to remove dogs
                        this.$dogList.on('click','.remove-dog',function(){
                            var dog=$(this).parents('.namesList').data();
                            //alert("in remove event function, dog data id = "+dog.id);                    
                            octopus.removeDog(dog);
                        });

                        this.$dogProfile = $('.profile');
                        this.profileTemplate= $('script[data-template="profile"]').html();

                        this.$dogList.on('click','.dog-name',function(){
                            //alert("clicked on dog's name label");
                            var dogID=($(this).parents('.namesList').data()).id;
                            //alert(" dog.id= "+dogID);
                            octopus.setCurrentProfileID(dogID);
                            octopus.dogProfile(dogID);
                        });

                        
                        this.$dogProfile.on('click',"img",function(){
                            var currentId= octopus.getCurrentProfileID();
                            
                            var $muttVotes=$(".profile .dog-profile .dog-votes"); 
                            if(model.dogs[currentId-1].image.indexOf("cat.PNG")>=0){
                                //model.dogs[currentId-1].votes=-1; 
                                $muttVotes.html("Hey!! You're No Dog!!");
                                $muttVotes.addClass("toggleBig");
                                 $muttVotes.effect("pulsate",{times:1});
                                   // .then(octopus.addVote());
                                
                              /*  var demoTimeout;
                                clearTimeout(demoTimeout);                            
                                demoTimeout=setTimeout(function(){                                
                                    octopus.addVote();
                                }, 500
                                );
                                */   
                            } else{
                                var no_votes= model.dogs[currentId-1].votes+1;                          
                                $muttVotes.html("Hot Dog!");
                                $muttVotes.addClass("toggle");                   
                                $muttVotes.toggleClass("toggleBig",100);

                                var demoTimeout;
                                $muttVotes.jrumble({x:30, y:5, rotation: 5, speed: 50});
                                $hotdog=$muttVotes;
                                clearTimeout(demoTimeout);
                                $hotdog.trigger('startRumble');
                                demoTimeout=setTimeout(function(){
                                    $hotdog.trigger('stopRumble');
                                    octopus.addVote();
                                }, 800
                                );       
                            }                                         
                        });

                        this.renderNames();
                        this.renderWelcome(true);
                        this.renderFooter();
                    },


                    renderNames: function(){
                        var $dogList=this.$dogList;
                        var dogListTemplate=this.dogListTemplate;
                        $dogList.html('');
                        model.dogs.forEach(function(dog){
                            //alert("in render dog.id= "+dog.id+ " dog.name= "+ dog.name);
                            var thisTemplate=dogListTemplate.replace(/{{name}}/g,dog.name)
                                                            .replace(/{{id}}/g,dog.id);
                            //alert("Render: dog name= "+dog.name+" id= "+ dog.id);
                            $dogList.append(thisTemplate);
                            
                        });                      
                    },

                    renderProfile: function(dogID){
                        //alert("in renderProfile, dogID= "+ dogID);
                        if(dogID== undefined){                          
                            var $dogProfile=this.$dogProfile;
                            $dogProfile.html('');
                        }
                        else if(dogID == -1){
                             var $dogProfile=this.$dogProfile;
                             $dogProfile.html('');
                             var noDogsMessage=
                               "<p class=\"sorry\">"+
                                    "Sorry!, no more dogs"
                               "</p>"
                             ;
                             $dogProfile.html(noDogsMessage);
                        }
                        else if(dogID >0) //when change dogID need >=0
                        {  //alert("in renderProfile dogID= "+  dogID);
                            var dog= model.dogs[dogID-1];
                            var $dogProfile=this.$dogProfile;
                            var profileTemplate=$('script[data-template="profile"]').html();
                            $dogProfile.html('');
                        //alert("dog.name= "+ dog.name+ " dog.image= "
                        //+ dog.image + " dog.votes= "+ dog.votes);
                         //   alert("profileTemplate= "+ profileTemplate);
                            var thisTemplate=profileTemplate.replace(/{{Big-Title}}/g,"")
                                                        .replace(/{{name}}/g,dog.name)
                                                        .replace(/{{image}}/g,dog.image)
                                                        .replace(/{{votes}}/g,dog.votes);
                        //    alert("before append template to profile");
                            $dogProfile.append(thisTemplate);
                        }
                        //alert("after append template to profile");  
                        this.renderWelcome(false);
                        this.renderFooter();                              
                    },

                    renderProfiles: function(SelectDogs){
                        var $dogProfile=this.$dogProfile;
                        var profileTemplate=$('script[data-template="profile"]').html();
                        $dogProfile.html('');
                        SelectDogs.forEach(function(dog){
                            var thisTemplate=profileTemplate
                                                .replace(/{{Big-Title}}/g,"Dogtastic!")
                                                .replace(/{{name}}/g,dog.name)
                                                .replace(/{{image}}/g,dog.image)
                                                 .replace(/{{votes}}/g,dog.votes);
                            
                            $dogProfile.append(thisTemplate);
                    });
                        this.renderWelcome(false);
                        this.renderFooter();
                },

                renderFooter: function(){
                        var $footer= this.$footer;
                        $footer.html('');
                        $footer.html("<p>Copyright &copy; Nonsense Tails Ltd. 2017"
                        +  "&nbsp; &nbsp; &nbsp;Images from"
                        + "&nbsp; <span style=\"font-style: italic;\"> Google-Images</span></p>");
                },


                renderWelcome: function(show){
                    var $welcome=this.$welcome;
                    var welcomeString='';
                   /* if (model.dogs.length > 0 ){
                        if(!$welcome.hasClass("welcome2"))
                            $welcome.addClass("welcome2");
                    }
                    else {
                        if($welcome.hasClass("welcome2"))
                            $welcome.removeClass("welcome2");
                    }
                    */
                    $welcome.html('');
                    if(show){
                        welcomeString=               
                        "<p>" +
                        "Welcome to DogClicker! This is a code sample based on cowclicker.com, "+
                        "where one clicks on an image of a cow to increment a click-counter. "+
                        "</p>"+
                     //"<p>"+
                        "<p> Directions: <p/>" +
                        "<ul>" +
                            "<li>- Select 'Add Dog' to add dogs to the list of profiles. </li>"+
                            "<li>- Click on the dog's name to pull up it's image. </li>" +
                            "<li>- Click on the dog's image to increment that dog's click-counter.</li>"+
                            "<li>- Select 'Top Dog' to display the dog(s) with the most clicks.</li>"+
                            "<li>- Select 'Reset' to reset all dog click-counters back to zero.</li>"+
                            "<li>- Select 'Remove' to remove a dog from the Profile list.</li>"+
                        "</ul>"+
                        "<p style=\"color: red; font-size: 120%\">" +
                            "Caution: Be wary when clicking on Muttley!"+
                        "</p>"+
                    // "</p>"+
                        "<p>"+
                        "This site was developed using HTML5, CSS3, JavaScript and Jquery. "+
                        "A Model-View-Controller design pattern with templates was employed." +
                        "</p>";
                    }
                    
                     $welcome.html(welcomeString);
                }
                
                };

                octopus.init();
            }());
        