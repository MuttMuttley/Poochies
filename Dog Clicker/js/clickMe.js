
 
            $(function(){

                //jQuery('.scrollbar-dynamic').scrollbar();
                //$('.col1-inner').niceScroll({cursorcolor:"#331a00"});

               /* $('#col1').niceScroll(
                            {cursorcolor:"#ff0066", background:"#66b3ff"
                              ,autohidemode: false
                            });
                            */
                          

                var scroller;                        

                var pathToImages="images/dogPics/";

                var dogImages=["jackRussel.png","poodle2.png","cat.png", 
                                "jumpingWhiteDog.png" ,"chiwawa.png",
                                 "bassetHound.png","happyDog.png",
                                 "airdaleTerrior.png","exitedDog1.png",
                                 "japaneseDog.png","smallDog.png",
                                 "proudDog.png"
                                 ];
               

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
                               {name:"Arthur",isUsed:false},
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

                var controller={                  
                    addDog: function(){
                        
                        //To work on renumbering ids
                        var thisID= model.dogs.length+1;
                        
                        //var renderType = "";
                        if(thisID > dogNames.length){
                            //renderType = -1;
                            controller.NoMoreDogs();
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
                        
                            var dogImageFull=pathToImages.concat(dogImage);
                    
                             model.dogs.push({
                                id: thisID,
                                name: dogName,
                                image: dogImageFull,
                                votes: 0,
                            });          
                            model.currentProfileID = thisID;
                            
                            controller.dogProfile(thisID);
                        }
                        
                        view.renderNames();   
                                           
                    },

                    removeDog: function(dog){
                       
                       
                        var dogImage = model.dogs[dog.id-1].image.replace(pathToImages,'');
                        var index = dogImages.indexOf(dogImage);
                        var dogName= model.dogs[dog.id-1].name;
                       
                        dogNames[index].isUsed=false;

                        if(model.dogs.length > 1){
                            model.dogs.swapDogs(dog.id-1,model.dogs.length-1);
                            alert();
                        }
                            
                        model.dogs.pop();
                        
                        view.renderNames();
                        controller.bye(dogName);
                        
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
                        
                        view.renderProfile(dogID);
                        view.renderWelcome(false);
                        view.renderFooter();
                    },

                    addVote: function(){
                        var dogID= this.getCurrentProfileID();
                        var no_votes = model.dogs[dogID-1].votes++;
                        controller.dogProfile(dogID);
                    },

                    getMostClicks: function(){
                      
                        var mostclicks=model.dogs.mostClicks();
                        function hasMostClicks(dogs){
                            return (dogs.votes == mostclicks);
                        }
                        var topDogs = model.dogs.filter(hasMostClicks);

                        view.renderProfiles(topDogs);
                        view.renderWelcome(false);
                        view.renderFooter(); 
                        
                    },

                    resetClicks: function(){
                        for(var i=0; i< model.dogs.length; i++){
                            model.dogs[i].votes=0;
                        }
                        
                        view.renderReset();
                        view.renderWelcome(false);
                        view.renderFooter();  
                    },

                    instructions: function(){
                         view.renderBlank();                
                         view.renderWelcome(true);
                         view.renderFooter();
                    
                    },

                    blankPage: function(){
                        view.renderBlank();
                        view.renderWelcome(true);
                        view.renderFooter();
                    },

                    NoMoreDogs: function(){
                        
                        view.renderNoMoreDogs();
                        view.renderWelcome(false);
                        view.renderFooter();  
                    },

                    bye: function(dogName){
                        view.renderBye(dogName);
                        view.renderWelcome(false);
                        view.renderFooter();
                    }
                 
                };

                var view={

                   
                    init: function(){

                      
                        var addDogBtn=$('.add-dog');
                        addDogBtn.click(   
                            function(){
                                controller.addDog();
                            
                        });
                        
                        var topDogBtn=$('.top-dog');
                        topDogBtn.click(
                            function(){
                                controller.getMostClicks();
                            }
                        );

                        var resetClicksBtn=$('.reset-clicks');
                        resetClicksBtn.click(
                            function(){
                                controller.resetClicks();
                            }
                        );

                        var instructionsBtn=$('.instructions');
                        instructionsBtn.click(
                            function(){
                                controller.instructions();
                            }
                        );
     
                        this.$dogList=$('.dog-list');
                        this.dogListTemplate=$('script[data-template="names"]').html();

                        this.$welcome=$('.welcome');

                        this.$footer=$('.footer');

                       
                        this.$dogList.on('click','.remove-dog',function(){
                            var dog=$(this).parents('.namesList').data();
                                               
                            controller.removeDog(dog);
                        });

                        this.$dogProfile = $('.profile');
                        this.profileTemplate= $('script[data-template="profile"]').html();

                        this.$dogList.on('click','.dog-name',function(){
                            
                            var dogID=($(this).parents('.namesList').data()).id;
                            
                            controller.setCurrentProfileID(dogID);
                            controller.dogProfile(dogID);
                        });

                        
                        this.$dogProfile.on('click',"img",function(event){
                            
                             
                            var currentId=event.target.getAttribute("data-id");
                            controller.setCurrentProfileID(currentId);
                            controller.dogProfile(currentId);
                            
                            var $muttVotes=$(".profile .dog-profile .dog-votes");
                            if(model.dogs[currentId-1].image.indexOf("cat.png")>=0){
                                 
                                $muttVotes.html("Hey!! You're No Dog!!");
                                $muttVotes.addClass("toggleBig");
                                 $muttVotes.effect("pulsate",{times:1});
                                  
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
                                    
                                    controller.addVote();
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
                            
                            var thisTemplate=dogListTemplate.replace(/{{name}}/g,dog.name)
                                                            .replace(/{{id}}/g,dog.id);
                            
                            $dogList.append(thisTemplate);
                            
                        });  
                         
                        if(scroller == undefined){
                            scroller= $('#col1-inner').niceScroll(
                            {cursorcolor:"#0066ff", background:"#ffffff"
                              ,cursorborder: "1px solid #0066ff"
                              ,autohidemode: false
                            });
                        }
                        else{
                            $("#col1-inner").getNiceScroll().resize();
                        }
                        
                                          
                    },

                    renderBlank: function(){
                         var $dogProfile=this.$dogProfile;
                         $dogProfile.html('');
                           
                    },

                    renderNoMoreDogs: function(){ 
                        var $dogProfile=this.$dogProfile;
                        var noDogsMessage=
                            "<p class=\"sorry\">"+
                                "Sorry!, no more dogs"
                            "</p>"
                             ;
                        $dogProfile.html(noDogsMessage);                         
                    },

                    renderReset: function(){
                        var $dogProfile=this.$dogProfile;
                        var ResetMessage=
                        "<p class=\"sorry\">" +
                        "All Click Counters Reset to Zero"+
                        "</p>";
                        $dogProfile.html(ResetMessage);
                        
                    },

                    renderProfile: function(dogID){
                        
                            var dog= model.dogs[dogID-1];
                            var $dogProfile=this.$dogProfile;
                            var profileTemplate=$('script[data-template="profile"]').html();
                            $dogProfile.html('');
                        
                            var thisTemplate=profileTemplate.replace(/{{id}}/g,dog.id)
                                                        .replace(/{{Big-Title}}/g,"")
                                                        .replace(/{{name}}/g,dog.name)
                                                        .replace(/{{image}}/g,dog.image)
                                                        .replace(/{{votes}}/g,dog.votes);
                        
                            $dogProfile.append(thisTemplate);
                                                  
                    },

                    renderProfiles: function(SelectDogs){
                        var $dogProfile=this.$dogProfile;
                        var profileTemplate=$('script[data-template="profile"]').html();
                        $dogProfile.html('');
                        SelectDogs.forEach(function(dog){
                            var thisTemplate=profileTemplate.replace(/{{id}}/g,dog.id)
                                                .replace(/{{Big-Title}}/g,"Dogtastic!")
                                                .replace(/{{name}}/g,dog.name)
                                                .replace(/{{image}}/g,dog.image)
                                                 .replace(/{{votes}}/g,dog.votes);
                            
                            $dogProfile.append(thisTemplate);
                    });
                        
                },

                renderFooter: function(){
                        var $footer= this.$footer;
                        $footer.html('');
                        $footer.html("<p>Copyright &copy; Nonsense Tails Ltd. 2017"
                        +  "&nbsp; &nbsp; &nbsp;Images from"
                        + "&nbsp; <span style=\"font-style: italic;\"> Google-Images</span></p>");
                },

                renderBye: function(dogName){
                    var $dogProfile=this.$dogProfile;
                    var sadPug=pathToImages.concat("sadPug.png"); 
                    var byeMessage= "<p class=\"sorry\">"+
                    "Bye Bye "+ dogName + "&nbsp;"+
                    "<img id= \"bye\" src = \"images/dogPics/sadFace.png\" />" +
                    "</p>";
                    $dogProfile.html(byeMessage);
                },


                renderWelcome: function(show){
                    var $welcome=this.$welcome;
                    var welcomeString='';
                   
                    $welcome.html('');
                    if(show){
                        welcomeString=               
                        "<p>" +
                        "Welcome to DogClicker! This is a JavaScript code sample based on cowclicker.com, "+
                        "where one clicks on an image of a cow to increment a click-counter. "+
                        "</p>"+
                     
                        "<p> Directions: <p/>" +
                        "<ul>" +
                            "<li>- Select 'Add Dog' to add dogs to the list of profiles. </li>"+
                            "<li>- Click on the dog's name to pull up it's image. </li>" +
                            "<li>- Click on the dog's image to increment that dog's click-counter.</li>"+
                            "<li>- Select 'Top Dog' to display the dog(s) with the most clicks.</li>"+
                            "<li>- Select 'Reset' to reset all dog click-counters back to zero.</li>"+
                            "<li>- Select 'Remove' to remove a dog from the Profile list.</li>"+
                        "</ul>"+
                     
                        "<p>"+
                        "This site was developed using HTML5, CSS3, JavaScript and Jquery. "+
                        "A Model-View-Controller design pattern with templates was employed." +
                        "</p>"+
                        "<p style=\"font-style: italic\">"+
                        "Not designed for use with mobile devices."+
                        "</p>"
                        ;
                    }
                    
                     $welcome.html(welcomeString);
                     
                }
                
                };

                controller.init();
            }());
        