describe("Canvas", function() {
  var _ = whiteboard,
      Canvas = _.Canvas;
      c = new Canvas();

  describe("module ", function() {

    describe("attributes", function() {

      describe(".active", function() {

        it("exists", function() {
          whiteboard.Canvas.hasOwnProperty('active');
        });

      });

      describe(".all", function() {
        before(function(){
          _.Store.init();
        });

        it("is automatically updated as new Canvases are discovered by Stores", function() {
          expect(Canvas.all).to.not.be.empty();
        });

        it("contains references to canvas wrappers", function() {
          expect(Canvas.all[0]).to.have.property("source");
          expect(Canvas.all[0]).to.have.property("target");
        });

        describe("Canvas Wrapper interface to Store", function() {
          var canvas;
          before(function() {
            canvas = Canvas.all[0];
          });

          describe("#source", function() {
            it("is one of the Stores found under whiteboard.Store", function() {
              expect(_.Store).to.have.property("Local",canvas.source);
            });
          });
          describe("#target", function() {
            it("is the toJSON pojo of a canvas", function() {
              expect(canvas.target).to.eql(c.toJSON());
            });
          });
        });
      })

    });

    describe("functions", function() {

      describe("init", function() {
        Canvas.init();

        it("sets an active canvas", function() {
          expect(Canvas.active).to.be.ok();
        });

        it("adds/updates strokes on StrokeAction|Stroke.*.commit events", function() {
					var stroke =  _.test.helpers.paintStroke();
          _.emit("StrokeAction.hey.commit", {target: stroke, stroke: stroke});
          expect(Canvas.active.strokes[stroke.strokeId].strokeId).to.be(stroke.strokeId);
        });

      });

    });

  });


  describe("instance ", function() {
    describe("attributes", function() {
      describe("#strokes", function() {
        it("is a POJO", function() {
          expect(c.hasOwnProperty("strokes")).to.be(true);
          expect(typeof c.strokes).to.be('object');
        });

      });
      describe("#id", function() {
        it("is a string", function() {
          expect(c.hasOwnProperty("id")).to.be(true);
          expect(typeof c.id).to.be('string');
        });
      });
      describe("#name", function() {
        it("is a string", function() {
          expect(c.hasOwnProperty("name")).to.be(true);
          expect(typeof c.name).to.be('string');
        });
      });
    });

    describe("methods", function() {

      describe("#set", function() {
        it("sets arbitrary key/value pairs", function() {
          c.set("what", "the");
          expect(c.what).to.be("the");
        });
        
        it("emits a Canvas.update.commit event", function() {
          var handlerCalled = false;
          _.on("Canvas.update.commit", function() {
            handlerCalled = true;
          });
          c.set("hey", "there");
          expect(handlerCalled).to.be(true);
        });
      });

      describe("#toJSON", function() {
        var pojo;
        before(function() {
          pojo = c.toJSON();
        });
        it("returns a POJO safe for JSON.stringify", function() {
          expect(pojo).to.be.a('object');
          expect(function(){
            JSON.stringify(pojo);
          }).to.not.throwException();
        });

        it("converts the strokes hash of HTMLElements to an array of ids", function() {
          expect(pojo.strokes).to.be.an('array');
        });
      });
    });
  });



});
