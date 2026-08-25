const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cheerio = require("cheerio");



/* GOOBROW ACADEMIC SUPER ENGINE */

function goobrowAcademicVisual(query){

  const q=String(query||"").toLowerCase().trim();

  const topics={

    "cell":{
      title:"Cell Structure",
      subject:"Biology",
      explanation:"A cell is the basic structural and functional unit of life. Plant and animal cells contain structures that perform specialized functions.",
      keyPoints:[
        "The nucleus controls many activities of the cell.",
        "The cytoplasm is where many chemical reactions occur.",
        "The cell membrane controls movement of substances in and out.",
        "Plant cells also contain a cell wall, chloroplasts and a large vacuole."
      ],
      diagram:"<svg viewBox='0 0 760 430' xmlns='http://www.w3.org/2000/svg'><rect x='40' y='45' width='680' height='320' rx='70' fill='#e8f5e9' stroke='#247a45' stroke-width='6'/><ellipse cx='380' cy='205' rx='95' ry='75' fill='#dbeafe' stroke='#315a9b' stroke-width='5'/><circle cx='380' cy='205' r='28' fill='#7aa7e8'/><ellipse cx='180' cy='130' rx='65' ry='30' fill='#b8e6b8' stroke='#277a45' stroke-width='4'/><ellipse cx='580' cy='130' rx='65' ry='30' fill='#b8e6b8' stroke='#277a45' stroke-width='4'/><circle cx='180' cy='285' r='48' fill='#d6f0ff' stroke='#277a45' stroke-width='4'/><text x='380' y='210' text-anchor='middle' font-size='22'>NUCLEUS</text><text x='180' y='95' text-anchor='middle' font-size='17'>CHLOROPLAST</text><text x='580' y='95' text-anchor='middle' font-size='17'>CHLOROPLAST</text><text x='180' y='350' text-anchor='middle' font-size='17'>VACUOLE</text><text x='380' y='405' text-anchor='middle' font-size='19'>CELL MEMBRANE / CYTOPLASM</text></svg>"
    },

    "photosynthesis":{
      title:"Photosynthesis",
      subject:"Biology",
      explanation:"Photosynthesis is the process by which green plants use light energy to convert carbon dioxide and water into glucose, releasing oxygen.",
      keyPoints:[
        "It takes place mainly in chloroplasts.",
        "Chlorophyll absorbs light energy.",
        "Carbon dioxide enters the leaf.",
        "Water is absorbed by the roots.",
        "Glucose is produced and oxygen is released."
      ],
      formula:"Carbon dioxide + Water → Glucose + Oxygen",
      diagram:"<svg viewBox='0 0 800 430' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='75' r='45' fill='#ffd84d' stroke='#b88600' stroke-width='4'/><text x='100' y='82' text-anchor='middle' font-size='18'>SUN</text><path d='M390 350 C280 390 200 330 210 250 C300 270 350 300 390 350 C430 300 500 270 590 250 C600 330 520 390 390 350Z' fill='#69b96b' stroke='#277a45' stroke-width='5'/><line x1='145' y1='100' x2='300' y2='185' stroke='#d9a500' stroke-width='8'/><line x1='210' y1='240' x2='310' y2='215' stroke='#555' stroke-width='5'/><line x1='490' y1='215' x2='650' y2='215' stroke='#555' stroke-width='5'/><text x='210' y='145' font-size='19'>LIGHT ENERGY</text><text x='155' y='225' font-size='18'>CO₂ + WATER</text><text x='650' y='210' font-size='18'>O₂</text><text x='390' y='255' text-anchor='middle' font-size='22'>GREEN PLANT</text><text x='390' y='410' text-anchor='middle' font-size='21'>GLUCOSE</text></svg>"
    },

    "atom":{
      title:"Structure of an Atom",
      subject:"Chemistry",
      explanation:"An atom consists of a central nucleus containing protons and neutrons, with electrons occupying regions around the nucleus.",
      keyPoints:[
        "Protons have a positive charge.",
        "Electrons have a negative charge.",
        "Neutrons have no electrical charge.",
        "Most of an atom's mass is concentrated in the nucleus."
      ],
      diagram:"<svg viewBox='0 0 760 430' xmlns='http://www.w3.org/2000/svg'><ellipse cx='380' cy='215' rx='270' ry='120' fill='none' stroke='#667085' stroke-width='4'/><ellipse cx='380' cy='215' rx='165' ry='75' fill='none' stroke='#667085' stroke-width='4'/><circle cx='380' cy='215' r='75' fill='#eadcff' stroke='#6941a5' stroke-width='5'/><circle cx='350' cy='195' r='15' fill='#e65b5b'/><circle cx='380' cy='230' r='15' fill='#777'/><circle cx='410' cy='195' r='15' fill='#e65b5b'/><circle cx='215' cy='215' r='14' fill='#4d8bd6'/><circle cx='545' cy='215' r='14' fill='#4d8bd6'/><circle cx='380' cy='95' r='14' fill='#4d8bd6'/><text x='380' y='220' text-anchor='middle' font-size='20'>NUCLEUS</text><text x='570' y='215' font-size='17'>ELECTRON</text><text x='420' y='180' font-size='17'>PROTON</text><text x='420' y='255' font-size='17'>NEUTRON</text></svg>"
    },

    "water":{
      title:"Water Cycle",
      subject:"Geography / Basic Science",
      explanation:"The water cycle describes the continuous movement of water between the Earth's surface and the atmosphere.",
      keyPoints:[
        "Evaporation changes liquid water into water vapour.",
        "Condensation forms clouds.",
        "Precipitation returns water to Earth.",
        "Collection and runoff return water to rivers, lakes and oceans."
      ],
      diagram:"<svg viewBox='0 0 800 430' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='70' r='45' fill='#ffd84d'/><path d='M0 320 Q180 270 400 320 T800 320 V430 H0Z' fill='#75aadb'/><path d='M210 145 Q300 90 380 145 Q460 90 550 145 Q620 110 690 155 Q700 190 650 205 H210Z' fill='#eee' stroke='#777' stroke-width='3'/><path d='M260 290 C260 235 260 200 260 150' stroke='#3b82c4' stroke-width='8'/><path d='M540 150 C540 210 540 250 540 300' stroke='#3b82c4' stroke-width='8'/><text x='170' y='300' font-size='19'>EVAPORATION</text><text x='420' y='120' font-size='19'>CONDENSATION</text><text x='500' y='350' font-size='19'>PRECIPITATION</text><text x='70' y='390' font-size='18'>OCEANS / LAKES</text></svg>"
    },

    "heart":{
      title:"Human Heart",
      subject:"Biology",
      explanation:"The heart is a muscular organ that pumps blood throughout the body. The right side sends deoxygenated blood to the lungs while the left side pumps oxygenated blood to the body.",
      keyPoints:[
        "The heart has four chambers.",
        "The right atrium receives deoxygenated blood.",
        "The right ventricle pumps blood to the lungs.",
        "The left atrium receives oxygenated blood.",
        "The left ventricle pumps blood around the body."
      ],
      diagram:"<svg viewBox='0 0 700 450' xmlns='http://www.w3.org/2000/svg'><path d='M350 390 C270 330 130 260 155 145 C170 75 255 75 350 165 C445 75 530 75 545 145 C570 260 430 330 350 390Z' fill='#f28b82' stroke='#9b2c2c' stroke-width='6'/><line x1='350' y1='165' x2='350' y2='360' stroke='#9b2c2c' stroke-width='5'/><text x='245' y='220' font-size='20'>RIGHT SIDE</text><text x='370' y='220' font-size='20'>LEFT SIDE</text><text x='350' y='425' text-anchor='middle' font-size='20'>HEART — PUMPS BLOOD</text></svg>"
    },

    "circuit":{
      title:"Simple Electric Circuit",
      subject:"Physics",
      explanation:"A simple electric circuit is a closed path through which electric current flows. A battery provides electrical energy and the lamp uses that energy.",
      keyPoints:[
        "The battery provides a potential difference.",
        "Wires provide the conducting path.",
        "The circuit must be closed for current to flow.",
        "The lamp converts electrical energy into light and heat."
      ],
      diagram:"<svg viewBox='0 0 800 430' xmlns='http://www.w3.org/2000/svg'><path d='M120 100 H300 M390 100 H660 V320 H120 V100' fill='none' stroke='#333' stroke-width='6'/><line x1='300' y1='65' x2='300' y2='135' stroke='#333' stroke-width='9'/><line x1='335' y1='78' x2='335' y2='122' stroke='#333' stroke-width='5'/><circle cx='345' cy='320' r='48' fill='#fff4a8' stroke='#333' stroke-width='5'/><path d='M320 295 L370 345 M370 295 L320 345' stroke='#333' stroke-width='4'/><text x='320' y='45' text-anchor='middle' font-size='19'>BATTERY</text><text x='345' y='400' text-anchor='middle' font-size='19'>LAMP</text><text x='525' y='85' font-size='18'>WIRE</text><text x='450' y='115' font-size='18'>CURRENT</text></svg>"
    },

    "solar":{
      title:"Solar System",
      subject:"Basic Science / Geography",
      explanation:"The solar system consists of the Sun and objects that orbit it. The planets are held in their orbits mainly by gravity.",
      keyPoints:[
        "The Sun is the central star.",
        "There are eight recognized planets.",
        "The inner planets are rocky.",
        "The outer planets are giant planets.",
        "Gravity keeps planets in orbit."
      ],
      diagram:"<svg viewBox='0 0 900 380' xmlns='http://www.w3.org/2000/svg'><circle cx='75' cy='190' r='58' fill='#ffd84d'/><circle cx='180' cy='190' r='9' fill='#aaa'/><circle cx='225' cy='190' r='13' fill='#d88'/><circle cx='275' cy='190' r='15' fill='#77a'/><circle cx='330' cy='190' r='16' fill='#69a96b'/><circle cx='430' cy='190' r='27' fill='#d69b65'/><circle cx='545' cy='190' r='34' fill='#d9c08b'/><circle cx='680' cy='190' r='28' fill='#8fc4d9'/><circle cx='795' cy='190' r='27' fill='#7d86c9'/><text x='75' y='280' text-anchor='middle' font-size='18'>SUN</text><text x='330' y='235' text-anchor='middle' font-size='15'>EARTH</text><text x='545' y='245' text-anchor='middle' font-size='15'>JUPITER</text></svg>"
    },

    "foodchain":{
      title:"Food Chain",
      subject:"Biology",
      explanation:"A food chain shows how energy and nutrients move from one organism to another.",
      keyPoints:[
        "Plants are producers.",
        "Herbivores are primary consumers.",
        "Carnivores may be secondary or higher consumers.",
        "Energy flows from one trophic level to another."
      ],
      diagram:"<svg viewBox='0 0 850 320' xmlns='http://www.w3.org/2000/svg'><rect x='30' y='110' width='170' height='80' rx='15' fill='#b8e6b8'/><rect x='235' y='110' width='170' height='80' rx='15' fill='#f6e58d'/><rect x='440' y='110' width='170' height='80' rx='15' fill='#f3b7b7'/><rect x='645' y='110' width='170' height='80' rx='15' fill='#d8b4fe'/><text x='115' y='158' text-anchor='middle' font-size='18'>PLANT</text><text x='320' y='158' text-anchor='middle' font-size='18'>HERBIVORE</text><text x='525' y='158' text-anchor='middle' font-size='18'>CARNIVORE</text><text x='730' y='158' text-anchor='middle' font-size='17'>TOP PREDATOR</text><path d='M200 150 H230 M405 150 H435 M610 150 H640' stroke='#333' stroke-width='5'/><text x='425' y='70' text-anchor='middle' font-size='21'>ENERGY FLOWS →</text></svg>"
    }

  };

  if(/plant cell|animal cell|cell structure|cell/.test(q)) return topics.cell;
  if(/photosynthesis|photosynthetic/.test(q)) return topics.photosynthesis;
  if(/atom|atomic structure|electron|proton|neutron/.test(q)) return topics.atom;
  if(/water cycle|hydrologic cycle|evaporation|condensation|precipitation/.test(q)) return topics.water;
  if(/heart|human heart|cardiac/.test(q)) return topics.heart;
  if(/electric circuit|simple circuit|circuit|battery|electricity/.test(q)) return topics.circuit;
  if(/solar system|planets|planet/.test(q)) return topics.solar;
  if(/food chain|food web|producer|consumer|predator/.test(q)) return topics.foodchain;

  return null;
}

/* END GOOBROW ACADEMIC SUPER ENGINE */


/* GOOBROW VISUAL LEARNING TOPIC PACK */

function goobrowVisualLearningTopic(query){

  const q=String(query||"").toLowerCase().trim();

  const topics={

    digestive:{
      title:"Human Digestive System",
      subject:"Biology",
      explanation:"The digestive system breaks food down into smaller substances that the body can absorb and use.",
      keyPoints:[
        "The mouth begins digestion by chewing food and mixing it with saliva.",
        "The oesophagus carries food to the stomach.",
        "The stomach mixes food with digestive juices.",
        "The small intestine completes much of digestion and absorbs nutrients.",
        "The large intestine absorbs much of the remaining water.",
        "The rectum and anus remove undigested waste."
      ],
      example:"Food travels through the digestive tract from the mouth to the oesophagus, stomach, small intestine, large intestine and finally out of the body.",
      quiz:[
        "Which organ receives food immediately after the oesophagus?",
        "Where are most digested nutrients absorbed?"
      ],
      diagram:"<svg viewBox='0 0 760 620' xmlns='http://www.w3.org/2000/svg'><path d='M380 75 C330 75 320 115 350 140 L350 180 C300 210 295 270 350 300 C330 360 350 410 390 440 C350 500 360 550 405 570' fill='none' stroke='#c96b4b' stroke-width='32' stroke-linecap='round'/><ellipse cx='390' cy='245' rx='90' ry='55' fill='#f3b5a5' stroke='#9b4b3c' stroke-width='5'/><path d='M410 300 C470 340 470 430 420 470' fill='none' stroke='#d58a68' stroke-width='22'/><path d='M420 470 C520 475 550 540 470 565' fill='none' stroke='#9b7b55' stroke-width='28'/><text x='470' y='240' font-size='20'>STOMACH</text><text x='500' y='360' font-size='19'>SMALL INTESTINE</text><text x='520' y='535' font-size='19'>LARGE INTESTINE</text><text x='380' y='45' text-anchor='middle' font-size='20'>MOUTH / OESOPHAGUS</text></svg>"
    },

    respiratory:{
      title:"Human Respiratory System",
      subject:"Biology",
      explanation:"The respiratory system allows the body to take in oxygen and remove carbon dioxide.",
      keyPoints:[
        "Air enters through the nose or mouth.",
        "The trachea carries air toward the lungs.",
        "The bronchi carry air into each lung.",
        "Bronchioles distribute air inside the lungs.",
        "Alveoli are tiny air sacs where gas exchange occurs.",
        "The diaphragm helps breathing."
      ],
      example:"During inhalation, the diaphragm contracts and moves downward, helping air enter the lungs.",
      quiz:[
        "Where does gas exchange occur?",
        "Which muscle helps the lungs during breathing?"
      ],
      diagram:"<svg viewBox='0 0 760 560' xmlns='http://www.w3.org/2000/svg'><path d='M380 80 V180 M380 180 L300 230 M380 180 L460 230' stroke='#555' stroke-width='20' fill='none'/><path d='M300 230 C210 200 155 310 220 450 C250 510 325 480 350 410 L350 260Z' fill='#f3b7b7' stroke='#a33' stroke-width='5'/><path d='M460 230 C550 200 605 310 540 450 C510 510 435 480 410 410 L410 260Z' fill='#f3b7b7' stroke='#a33' stroke-width='5'/><line x1='350' y1='280' x2='410' y2='280' stroke='#555' stroke-width='10'/><text x='380' y='55' text-anchor='middle' font-size='21'>TRACHEA</text><text x='220' y='330' font-size='20'>LEFT LUNG</text><text x='455' y='330' font-size='20'>RIGHT LUNG</text><text x='380' y='530' text-anchor='middle' font-size='20'>DIAPHRAGM</text></svg>"
    },

    flower:{
      title:"Parts of a Flower",
      subject:"Biology",
      explanation:"A flower is the reproductive structure of many flowering plants. Its parts work together to enable pollination and reproduction.",
      keyPoints:[
        "Petals attract pollinators.",
        "The anther produces pollen.",
        "The filament supports the anther.",
        "The stigma receives pollen.",
        "The style connects the stigma to the ovary.",
        "The ovary contains ovules."
      ],
      example:"In many flowering plants, insects transfer pollen from an anther to a stigma.",
      quiz:[
        "Which part produces pollen?",
        "Which part receives pollen?"
      ],
      diagram:"<svg viewBox='0 0 760 560' xmlns='http://www.w3.org/2000/svg'><path d='M380 500 V280' stroke='#277a45' stroke-width='18'/><path d='M380 380 C300 350 250 390 215 430 C300 440 350 420 380 380Z' fill='#69b96b' stroke='#277a45' stroke-width='4'/><path d='M380 380 C460 350 510 390 545 430 C460 440 410 420 380 380Z' fill='#69b96b' stroke='#277a45' stroke-width='4'/><ellipse cx='380' cy='250' rx='55' ry='85' fill='#f3b7d2' stroke='#a43b6f' stroke-width='5'/><ellipse cx='300' cy='250' rx='70' ry='45' fill='#f3b7d2' stroke='#a43b6f' stroke-width='5' transform='rotate(-30 300 250)'/><ellipse cx='460' cy='250' rx='70' ry='45' fill='#f3b7d2' stroke='#a43b6f' stroke-width='5' transform='rotate(30 460 250)'/><circle cx='380' cy='250' r='24' fill='#ffd84d' stroke='#a77a00' stroke-width='4'/><text x='380' y='130' text-anchor='middle' font-size='20'>STIGMA</text><text x='270' y='205' font-size='18'>PETAL</text><text x='390' y='255' font-size='17'>OVARY</text><text x='430' y='480' font-size='18'>LEAF</text></svg>"
    },

    dna:{
      title:"DNA Structure",
      subject:"Biology",
      explanation:"DNA is a molecule that stores genetic information. Its structure is commonly described as a double helix.",
      keyPoints:[
        "DNA contains genetic information.",
        "The two strands form a double helix.",
        "Bases pair in specific ways.",
        "A pairs with T.",
        "C pairs with G."
      ],
      example:"A DNA strand containing A-T-C-G has complementary bases T-A-G-C.",
      quiz:[
        "What shape is DNA commonly described as?",
        "Which base pairs with adenine?"
      ],
      diagram:"<svg viewBox='0 0 760 500' xmlns='http://www.w3.org/2000/svg'><path d='M250 70 C500 130 500 370 250 430 M510 70 C260 130 260 370 510 430' fill='none' stroke='#4169a1' stroke-width='8'/><g stroke='#777' stroke-width='7'><line x1='300' y1='105' x2='460' y2='105'/><line x1='350' y1='165' x2='410' y2='165'/><line x1='390' y1='225' x2='370' y2='225'/><line x1='410' y1='285' x2='350' y2='285'/><line x1='460' y1='345' x2='300' y2='345'/><line x1='490' y1='405' x2='270' y2='405'/></g><text x='380' y='465' text-anchor='middle' font-size='22'>DNA DOUBLE HELIX</text></svg>"
    },

    bonding:{
      title:"Chemical Bonding",
      subject:"Chemistry",
      explanation:"Chemical bonding is the attraction that holds atoms together in molecules or compounds.",
      keyPoints:[
        "Ionic bonding involves transfer of electrons.",
        "Covalent bonding involves sharing electrons.",
        "Metallic bonding occurs between metal atoms.",
        "Atoms bond to reach more stable electron arrangements."
      ],
      example:"Sodium chloride is commonly used as an example of an ionic compound.",
      quiz:[
        "What happens to electrons in ionic bonding?",
        "What happens to electrons in covalent bonding?"
      ],
      diagram:"<svg viewBox='0 0 760 420' xmlns='http://www.w3.org/2000/svg'><circle cx='270' cy='210' r='90' fill='#dbeafe' stroke='#315a9b' stroke-width='5'/><circle cx='490' cy='210' r='90' fill='#fde2e2' stroke='#a33' stroke-width='5'/><circle cx='380' cy='210' r='25' fill='#ffd84d' stroke='#9b7a00' stroke-width='4'/><text x='270' y='218' text-anchor='middle' font-size='23'>ATOM A</text><text x='490' y='218' text-anchor='middle' font-size='23'>ATOM B</text><text x='380' y='180' text-anchor='middle' font-size='18'>SHARED</text><text x='380' y='300' text-anchor='middle' font-size='22'>COVALENT BOND</text></svg>"
    },

    reflection:{
      title:"Reflection of Light",
      subject:"Physics",
      explanation:"Reflection occurs when light strikes a surface and bounces back.",
      keyPoints:[
        "The incident ray travels toward the surface.",
        "The reflected ray travels away from the surface.",
        "The normal is drawn perpendicular to the surface.",
        "The angle of incidence equals the angle of reflection."
      ],
      formula:"Angle of incidence = Angle of reflection",
      example:"A plane mirror reflects light so that the angle at which light arrives equals the angle at which it leaves.",
      quiz:[
        "What is the angle between the incident ray and the normal called?",
        "What is the relationship between the two angles?"
      ],
      diagram:"<svg viewBox='0 0 760 450' xmlns='http://www.w3.org/2000/svg'><line x1='380' y1='80' x2='380' y2='380' stroke='#888' stroke-width='4' stroke-dasharray='10 8'/><line x1='80' y1='380' x2='680' y2='380' stroke='#333' stroke-width='10'/><path d='M150 100 L380 380 L610 100' fill='none' stroke='#e0a000' stroke-width='8'/><text x='390' y='120' font-size='20'>NORMAL</text><text x='120' y='90' font-size='19'>INCIDENT RAY</text><text x='500' y='90' font-size='19'>REFLECTED RAY</text><text x='380' y='420' text-anchor='middle' font-size='20'>MIRROR</text></svg>"
    },

    force:{
      title:"Forces and Motion",
      subject:"Physics",
      explanation:"A force is a push or pull that can change the motion, direction or shape of an object.",
      keyPoints:[
        "Forces can be balanced or unbalanced.",
        "An unbalanced force can change motion.",
        "Friction opposes motion between surfaces.",
        "Gravity attracts objects toward Earth."
      ],
      formula:"Force = mass × acceleration (F = ma)",
      example:"If a 2 kg object accelerates at 3 m/s², the force is 6 N.",
      quiz:[
        "What is the SI unit of force?",
        "What equation relates force, mass and acceleration?"
      ],
      diagram:"<svg viewBox='0 0 760 400' xmlns='http://www.w3.org/2000/svg'><rect x='290' y='170' width='160' height='100' rx='12' fill='#dbeafe' stroke='#315a9b' stroke-width='5'/><path d='M100 220 H280 M460 220 H660' stroke='#555' stroke-width='10'/><path d='M100 220 l30 -18 M100 220 l30 18 M660 220 l-30 -18 M660 220 l-30 18' stroke='#555' stroke-width='7' fill='none'/><text x='370' y='230' text-anchor='middle' font-size='23'>OBJECT</text><text x='190' y='150' text-anchor='middle' font-size='20'>FORCE</text><text x='550' y='150' text-anchor='middle' font-size='20'>FORCE</text></svg>"
    },

    magnetism:{
      title:"Magnetic Field",
      subject:"Physics",
      explanation:"A magnetic field is the region around a magnet where magnetic forces can act.",
      keyPoints:[
        "Magnets have north and south poles.",
        "Like poles repel.",
        "Unlike poles attract.",
        "Magnetic field lines show the direction of the magnetic field."
      ],
      example:"A compass aligns with Earth's magnetic field.",
      quiz:[
        "What happens when like magnetic poles are brought together?",
        "What happens when unlike poles are brought together?"
      ],
      diagram:"<svg viewBox='0 0 760 430' xmlns='http://www.w3.org/2000/svg'><rect x='285' y='170' width='190' height='90' rx='12' fill='#e9e9e9' stroke='#555' stroke-width='5'/><rect x='285' y='170' width='95' height='90' fill='#f3a0a0'/><text x='330' y='225' text-anchor='middle' font-size='25'>N</text><text x='430' y='225' text-anchor='middle' font-size='25'>S</text><path d='M285 145 C170 70 90 160 160 215 C90 270 170 360 285 285' fill='none' stroke='#555' stroke-width='4'/><path d='M475 145 C590 70 670 160 600 215 C670 270 590 360 475 285' fill='none' stroke='#555' stroke-width='4'/><text x='380' y='380' text-anchor='middle' font-size='20'>MAGNETIC FIELD</text></svg>"
    },

    volcano:{
      title:"Volcano",
      subject:"Geography / Earth Science",
      explanation:"A volcano is an opening in Earth's crust through which molten rock, gases and ash can reach the surface.",
      keyPoints:[
        "Magma is molten rock beneath Earth's surface.",
        "Lava is molten rock that reaches the surface.",
        "Volcanic ash consists of tiny particles produced during eruptions.",
        "Volcanoes can form near tectonic plate boundaries."
      ],
      example:"When magma rises and reaches the surface, it can erupt as lava and volcanic material.",
      quiz:[
        "What is molten rock beneath Earth's surface called?",
        "What is molten rock on Earth's surface called?"
      ],
      diagram:"<svg viewBox='0 0 760 500' xmlns='http://www.w3.org/2000/svg'><path d='M90 450 L270 160 L380 110 L490 160 L670 450Z' fill='#c98d5b' stroke='#75452b' stroke-width='6'/><path d='M380 110 V55' stroke='#75452b' stroke-width='22'/><path d='M380 110 C330 180 330 250 380 310 C430 250 430 180 380 110Z' fill='#e85d3f' stroke='#9b2c2c' stroke-width='5'/><circle cx='350' cy='45' r='15' fill='#777'/><circle cx='410' cy='35' r='12' fill='#777'/><text x='380' y='480' text-anchor='middle' font-size='22'>VOLCANO</text><text x='400' y='240' font-size='18'>LAVA</text><text x='400' y='90' font-size='18'>ASH / GASES</text></svg>"
    },

    rockcycle:{
      title:"Rock Cycle",
      subject:"Geography / Earth Science",
      explanation:"The rock cycle describes how rocks change from one type to another through geological processes.",
      keyPoints:[
        "Igneous rocks form when molten rock cools.",
        "Weathering and erosion produce sediments.",
        "Sediments can form sedimentary rocks.",
        "Heat and pressure can form metamorphic rocks.",
        "Melting can return rocks to molten material."
      ],
      example:"A rock can be weathered into sediment, compacted into sedimentary rock, changed by heat and pressure, and eventually melted.",
      quiz:[
        "What type of rock forms when molten rock cools?",
        "What processes can change rocks through heat and pressure?"
      ],
      diagram:"<svg viewBox='0 0 760 500' xmlns='http://www.w3.org/2000/svg'><circle cx='380' cy='90' r='65' fill='#f6e58d' stroke='#777' stroke-width='4'/><circle cx='170' cy='250' r='65' fill='#b8e6b8' stroke='#277a45' stroke-width='4'/><circle cx='590' cy='250' r='65' fill='#d8b4fe' stroke='#6941a5' stroke-width='4'/><circle cx='380' cy='410' r='65' fill='#f3b7b7' stroke='#9b2c2c' stroke-width='4'/><path d='M320 130 L210 210 M440 130 L550 210 M210 315 L330 370 M550 315 L430 370' stroke='#555' stroke-width='6' fill='none'/><text x='380' y='97' text-anchor='middle' font-size='18'>IGNEOUS</text><text x='170' y='257' text-anchor='middle' font-size='18'>SEDIMENTARY</text><text x='590' y='257' text-anchor='middle' font-size='18'>METAMORPHIC</text><text x='380' y='417' text-anchor='middle' font-size='18'>MAGMA</text></svg>"
    }

  };

  if(/digestive system|digestion|digestive/.test(q)) return topics.digestive;
  if(/respiratory system|respiration|lungs|breathing/.test(q)) return topics.respiratory;
  if(/parts of a flower|flower structure|flower/.test(q)) return topics.flower;
  if(/dna|deoxyribonucleic/.test(q)) return topics.dna;
  if(/chemical bonding|ionic bond|covalent bond|metallic bond|bonding/.test(q)) return topics.bonding;
  if(/reflection of light|reflection|plane mirror/.test(q)) return topics.reflection;
  if(/force|forces|newton.*law|motion/.test(q)) return topics.force;
  if(/magnetism|magnetic field|magnet/.test(q)) return topics.magnetism;
  if(/volcano|volcanic eruption/.test(q)) return topics.volcano;
  if(/rock cycle|igneous rock|sedimentary rock|metamorphic rock/.test(q)) return topics.rockcycle;

  return null;
}

/* END GOOBROW VISUAL LEARNING TOPIC PACK */



const PORT = Number(process.env.PORT) || 3001;

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));


app.use(express.static(path.join(__dirname, "www")));


// ============================================================
// GOOBROW PERMANENT USERS + POSTS
// ============================================================


const bcrypt = require("bcryptjs");

const GOOBROW_DATA_DIR = path.join(__dirname, "data");
const GOOBROW_USERS_FILE = path.join(GOOBROW_DATA_DIR, "users.json");
const GOOBROW_POSTS_FILE = path.join(GOOBROW_DATA_DIR, "posts.json");

if (!fs.existsSync(GOOBROW_DATA_DIR)) {
  fs.mkdirSync(GOOBROW_DATA_DIR, { recursive: true });
}

function goobrowReadJSON(file, fallback){
  try{
    if(!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }catch(error){
    console.error("Goobrow JSON read error:", error.message);
    return fallback;
  }
}

function goobrowWriteJSON(file, data){
  const temp = file + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
}

function goobrowUsers(){
  return goobrowReadJSON(GOOBROW_USERS_FILE, []);
}

function goobrowPosts(){
  return goobrowReadJSON(GOOBROW_POSTS_FILE, []);
}

function goobrowEmail(value){
  return String(value || "").trim().toLowerCase();
}

function goobrowPublicUser(user){
  if(!user) return null;

  return {
    id:user.id,
    name:user.name,
    email:user.email,
    joined:user.joined,
    avatar:user.avatar || ""
  };
}

// ---------------- REGISTER ----------------

app.post("/api/register", express.json(), async (req,res)=>{
  try{
    const name=String(req.body?.name || "").trim();
    const email=goobrowEmail(req.body?.email);
    const password=String(req.body?.password || "");

    if(!name || !email || !password){
      return res.status(400).json({
        ok:false,
        error:"Please complete all fields."
      });
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      return res.status(400).json({
        ok:false,
        error:"Please enter a valid email address."
      });
    }

    if(password.length < 6){
      return res.status(400).json({
        ok:false,
        error:"Password must be at least 6 characters."
      });
    }

    const users=goobrowUsers();

    if(users.some(u=>u.email===email)){
      return res.status(409).json({
        ok:false,
        error:"An account with this email already exists."
      });
    }

    const user={
      id:"user_"+Date.now()+"_"+Math.random().toString(36).slice(2,10),
      name,
      email,
      passwordHash:await bcrypt.hash(password,10),
      joined:new Date().toISOString(),
      avatar:""
    };

    users.push(user);
    goobrowWriteJSON(GOOBROW_USERS_FILE,users);

    return res.json({
      ok:true,
      user:goobrowPublicUser(user)
    });

  }catch(error){
    console.error("Registration error:",error);
    return res.status(500).json({
      ok:false,
      error:"Registration failed."
    });
  }
});

// ---------------- LOGIN ----------------

app.post("/api/login", express.json(), async (req,res)=>{
  try{
    const email=goobrowEmail(req.body?.email);
    const password=String(req.body?.password || "");

    const users=goobrowUsers();
    const user=users.find(u=>u.email===email);

    if(!user){
      return res.status(401).json({
        ok:false,
        error:"Incorrect email or password."
      });
    }

    const valid=await bcrypt.compare(password,user.passwordHash);

    if(!valid){
      return res.status(401).json({
        ok:false,
        error:"Incorrect email or password."
      });
    }

    return res.json({
      ok:true,
      user:goobrowPublicUser(user)
    });

  }catch(error){
    console.error("Login error:",error);
    return res.status(500).json({
      ok:false,
      error:"Login failed."
    });
  }
});

// ---------------- PROFILE ----------------

app.get("/api/profile",(req,res)=>{
  const id=String(req.query.id || "");
  const email=goobrowEmail(req.query.email);

  const users=goobrowUsers();

  const user=users.find(u=>
    (id && u.id===id) ||
    (email && u.email===email)
  );

  if(!user){
    return res.status(404).json({
      ok:false,
      error:"Profile not found."
    });
  }

  const posts=goobrowPosts()
    .filter(p=>p.userId===user.id)
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));

  return res.json({
    ok:true,
    user:goobrowPublicUser(user),
    posts
  });
});

// ============================================================
// CREATE POST
// ============================================================

app.post("/api/posts", express.json(), (req,res)=>{
  try{
    const userId=String(req.body?.userId || "").trim();
    const text=String(req.body?.text || "").trim();

    if(!userId || !text){
      return res.status(400).json({
        ok:false,
        error:"Please sign in and write something."
      });
    }

    if(text.length > 1000){
      return res.status(400).json({
        ok:false,
        error:"Post is too long. Maximum 1000 characters."
      });
    }

    const users=goobrowUsers();
    const user=users.find(u=>u.id===userId);

    if(!user){
      return res.status(401).json({
        ok:false,
        error:"Please sign in again."
      });
    }

    const posts=goobrowPosts();

    const post={
      id:"post_"+Date.now()+"_"+Math.random().toString(36).slice(2,10),
      userId:user.id,
      userName:user.name,
      userEmail:user.email,
      text,
      createdAt:new Date().toISOString(),
      likes:0
    };

    posts.push(post);
    goobrowWriteJSON(GOOBROW_POSTS_FILE,posts);

    return res.json({
      ok:true,
      post
    });

  }catch(error){
    console.error("Post error:",error);
    return res.status(500).json({
      ok:false,
      error:"Could not save post."
    });
  }
});

// ============================================================
// GET SAVED POSTS
// ============================================================

app.get("/api/posts",(req,res)=>{
  const posts=goobrowPosts()
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
    .slice(0,50);

  res.json({
    ok:true,
    posts
  });
});

// ============================================================
// LIKE POST
// ============================================================

app.post("/api/posts/:id/like",(req,res)=>{
  const posts=goobrowPosts();
  const post=posts.find(p=>p.id===req.params.id);

  if(!post){
    return res.status(404).json({
      ok:false,
      error:"Post not found."
    });
  }

  post.likes=Number(post.likes||0)+1;
  goobrowWriteJSON(GOOBROW_POSTS_FILE,posts);

  res.json({
    ok:true,
    likes:post.likes
  });
});

app.get("/api/suggestions", (req, res) => {
  const query = String(req.query.q || "")
    .trim()
    .toLowerCase();

  if (!query) {
    return res.json({
      suggestions: []
    });
  }

  const indexFile = path.join(
    __dirname,
    "data",
    "index.json"
  );

  let index = [];

  try {
    if (fs.existsSync(indexFile)) {
      index = JSON.parse(
        fs.readFileSync(indexFile, "utf8")
      );
    }
  } catch (error) {
    console.error(
      "Could not read Goobrow index:",
      error.message
    );
  }

  const suggestions = [];

  for (const page of index) {
    const title = String(page.title || "").trim();
    const url = String(page.url || "").trim();

    if (
      title.toLowerCase().includes(query) &&
      title
    ) {
      suggestions.push(title);
    }

    if (
      url.toLowerCase().includes(query) &&
      url
    ) {
      suggestions.push(url);
    }
  }

  const unique = [
    ...new Set(suggestions)
  ].slice(0, 8);

  res.json({
    suggestions: unique
  });
});

async function goobrowWebSearch(query){
  const url =
    "https://html.duckduckgo.com/html/?q=" +
    encodeURIComponent(query);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Android; Goobrow/1.0)"
    }
  });

  if(!response.ok){
    throw new Error("Web search returned HTTP " + response.status);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const results = [];

  $(".result").each((i, el) => {
    if(results.length >= 30) return;

    const title = $(el)
      .find(".result__a")
      .first()
      .text()
      .trim();

    const href = $(el)
      .find(".result__a")
      .first()
      .attr("href");

    const description = $(el)
      .find(".result__snippet")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    if(title && href){
      let finalUrl = href;

      try{
        const parsed = new URL(
          href.startsWith("//") ? "https:" + href : href
        );

        if(
          parsed.hostname.includes("duckduckgo.com") &&
          parsed.searchParams.has("uddg")
        ){
          finalUrl = decodeURIComponent(
            parsed.searchParams.get("uddg")
          );
        }
      }catch{}

      results.push({
        title,
        url: finalUrl,
        description
      });
    }
  });

  return results;
}



// GOOBROW_SEARCH_CACHE_ACTIVE
app.use("/api/search", async (req,res,next)=>{
  const q=String(req.query.q||"").trim().toLowerCase();
  if(!q) return next();

  const cached=fastSearchCacheGet(q);
  if(cached){
    res.set("X-Goobrow-Cache","HIT");
    return res.json(cached);
  }

  const originalJson=res.json.bind(res);
  res.json=(data)=>{
    fastSearchCacheSet(q,data);
    res.set("X-Goobrow-Cache","MISS");
    return originalJson(data);
  };

  next();
});


// GOOBROW FAST SEARCH CACHE
const goobrowSearchCache = new Map();
const GOOBROW_CACHE_TTL = 5 * 60 * 1000;

function fastSearchCacheGet(key){
  const item = goobrowSearchCache.get(key);
  if(!item) return null;

  if(Date.now() - item.time > GOOBROW_CACHE_TTL){
    goobrowSearchCache.delete(key);
    return null;
  }

  return item.data;
}

function fastSearchCacheSet(key,data){
  goobrowSearchCache.set(key,{
    time:Date.now(),
    data
  });

  if(goobrowSearchCache.size > 100){
    const firstKey=goobrowSearchCache.keys().next().value;
    if(firstKey) goobrowSearchCache.delete(firstKey);
  }
}


// GOOBROW FAST FETCH
async function fastFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: "follow"
    });
  } finally {
    clearTimeout(timeout);
  }
}


// GOOBROW LOCAL INDEX FALLBACK
let goobrowLocalIndex = [];

try {
  const fs = require("fs");
  const indexPath = path.join(__dirname, "data", "index.json");

  if (fs.existsSync(indexPath)) {
    goobrowLocalIndex = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    console.log("Goobrow local index loaded:", goobrowLocalIndex.length, "pages");
  }
} catch (error) {
  console.error("Goobrow local index failed:", error.message);
}

function localIndexSearch(query) {
  const words = String(query || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length || !Array.isArray(goobrowLocalIndex)) return [];

  const stopWords = new Set([
    "what","is","are","the","a","an","of","to","in","on",
    "for","how","why","when","where","who","does","do",
    "can","and","or","with","from","about"
  ]);

  const importantWords = words.filter(w => !stopWords.has(w));
  const searchWords = importantWords.length ? importantWords : words;

  const scored = [];

  for (const page of goobrowLocalIndex) {
    const title = String(page.title || "");
    const text = String(page.text || "");
    const url = String(page.url || "");

    const titleLower = title.toLowerCase();
    const textLower = text.toLowerCase();

    let score = 0;

    for (const word of searchWords) {
      if (titleLower === word) score += 100;
      if (titleLower.includes(word)) score += 30;
      if (textLower.includes(word)) score += 5;
      if (url.toLowerCase().includes(word)) score += 3;
    }

    // Reward pages matching multiple important words.
    if (searchWords.length > 1) {
      const matched = searchWords.filter(w =>
        titleLower.includes(w) || textLower.includes(w)
      ).length;

      score += matched * 10;
    }

    if (score > 0) {
      scored.push({
        score,
        result: {
          title: title || url,
          url,
          description: text.slice(0, 300)
        }
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return scored
    .slice(0, 10)
    .map(x => x.result);
}

app.get("/api/search", async (req,res)=>{
  const query = String(req.query.q || "").trim();

  if(!query){
    return res.json({
      engine:"Goobrow Search",
      query:"",
      results:[]
    });
  }

  const clean = x => String(x || "")
    .replace(/<script[\s\S]*?<\/script>/gi," ")
    .replace(/<style[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]*>/g," ")
    .replace(/&amp;/g,"&")
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&#x27;/g,"'")
    .replace(/&nbsp;/g," ")
    .replace(/\s+/g," ")
    .trim();

  const results = [];
  const seen = new Set();

  function addResult(title,url,description="",source=""){
    title = clean(title);
    url = String(url || "").trim();
    description = clean(description);

    if(!title || title.length < 2) return;
    if(!/^https?:\/\//i.test(url)) return;

    const key = url.toLowerCase().replace(/\/+$/,"");

    if(seen.has(key)) return;

    seen.add(key);

    results.push({
      title,
      url,
      description
    });
  }

  /*
   * =====================================================
   * 2. DUCKDUCKGO — BACKUP
   * =====================================================
   */
  if(results.length < 3){
    try{
      const url =
        "https://html.duckduckgo.com/html/?q=" +
        encodeURIComponent(query);

      const response = await fetch(url,{
        headers:{
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36",
          "Accept-Language":
            "en-US,en;q=0.9"
        }
      });

      if(response.ok){
        const html = await response.text();

        const blocks =
          html.split(/result__body/i);

        for(const block of blocks){
          if(results.length >= 10) break;

          const link =
            block.match(
              /result__a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i
            );

          if(!link) continue;

          let url = link[1];
          const title = clean(link[2]);

          const uddg =
            url.match(/[?&]uddg=([^&]+)/i);

          if(uddg){
            try{
              url = decodeURIComponent(uddg[1]);
            }catch{}
          }

          const snippet =
            block.match(
              /result__snippet[^>]*>([\s\S]*?)<\/(?:a|div)/i
            );

          addResult(
            title,
            url,
            snippet ? clean(snippet[1]) : "",
            "DuckDuckGo"
          );
        }
      }

      console.log(
        "Goobrow DuckDuckGo results:",
        results.length
      );
    }catch(error){
      console.error(
        "DuckDuckGo failed:",
        error.message
      );
    }
  }

  /*
   * =====================================================
   * 3. BING — BACKUP
   * =====================================================
   */
  if(results.length < 3){
    try{
      const url =
        "https://www.bing.com/search?q=" +
        encodeURIComponent(query);

      const response = await fetch(url,{
        headers:{
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36",
          "Accept-Language":
            "en-US,en;q=0.9"
        }
      });

      if(response.ok){
        const html = await response.text();

        const blocks =
          html.split(
            /<li[^>]+class=["'][^"']*b_algo[^"']*["'][^>]*>/i
          );

        for(const block of blocks){
          if(results.length >= 10) break;

          const link =
            block.match(
              /<h2[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i
            );

          if(!link) continue;

          const url = link[1];
          const title = clean(link[2]);

          const snippet =
            block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

          addResult(
            title,
            url,
            snippet ? clean(snippet[1]) : "",
            "Bing"
          );
        }
      }

      console.log(
        "Goobrow Bing results:",
        results.length
      );
    }catch(error){
      console.error(
        "Bing failed:",
        error.message
      );
    }
  }

  /*
   * =====================================================
   * 4. WIKIPEDIA — BACKUP
   * =====================================================
   */
  if(results.length < 3){
    try{
      const url =
        "https://en.wikipedia.org/w/api.php" +
        "?action=query" +
        "&list=search" +
        "&format=json" +
        "&utf8=1" +
        "&origin=*" +
        "&srlimit=10" +
        "&srsearch=" +
        encodeURIComponent(query);

      const response = await fetch(url,{
        headers:{
          "User-Agent":
            "Goobrow/1.0 Search Engine"
        }
      });

      if(response.ok){
        const data = await response.json();

        if(
          data.query &&
          Array.isArray(data.query.search)
        ){
          for(const item of data.query.search){
            if(results.length >= 10) break;

            addResult(
              item.title,
              "https://en.wikipedia.org/wiki/" +
                encodeURIComponent(
                  item.title.replace(/ /g,"_")
                ),
              clean(item.snippet),
              "Wikipedia"
            );
          }
        }
      }

      console.log(
        "Goobrow Wikipedia results:",
        results.length
      );
    }catch(error){
      console.error(
        "Wikipedia failed:",
        error.message
      );
    }
  }

  /*
   * =====================================================
   * 5. LOCAL GOOBROW INDEX — FINAL FALLBACK
   * =====================================================
   */
  if(results.length === 0){
    try{
      const local =
        localIndexSearch(query) || [];

      for(const item of local){
        if(results.length >= 10) break;

        addResult(
          item.title,
          item.url,
          item.description || "",
          "Goobrow"
        );
      }

      console.log(
        "Goobrow local results:",
        results.length
      );
    }catch(error){
      console.error(
        "Local search failed:",
        error.message
      );
    }
  }

  /*
   * =====================================================
   * FINAL GOOBROW OUTPUT
   *
   * Source names are deliberately NOT returned.
   * Everything is presented as Goobrow results.
   * =====================================================
   */
  const finalResults =
    results.slice(0,10).map(item=>({
      title:item.title,
      url:item.url,
      description:item.description
    }));

  const data = {
    engine:"Goobrow Search",
    query,
    results:finalResults
  };

  if(finalResults.length){
    try{
      fastSearchCacheSet(
        query.toLowerCase(),
        data
      );
    }catch{}

    res.set(
      "X-Goobrow-Cache",
      "MISS"
    );

    return res.json(data);
  }

  return res.status(200).json({
    engine:"Goobrow Search",
    query,
    results:[],
    error:"No results found"
  });
});

app.get("/api/suggestions", async (req,res)=>{
  const query = String(req.query.q || "").trim();

  if(!query){
    return res.json({
      suggestions: []
    });
  }

  /*
   * Use DuckDuckGo's suggestion endpoint first.
   * Fall back to the local Goobrow index if necessary.
   */
  try{
    const response = await fetch(
      "https://duckduckgo.com/ac/?q=" +
      encodeURIComponent(query),
      {
        headers:{
          "User-Agent":"Mozilla/5.0 (Android; Goobrow/1.0)"
        }
      }
    );

    if(response.ok){
      const data = await response.json();

      const suggestions = data
        .map(item => item.phrase)
        .filter(Boolean)
        .slice(0,8);

      return res.json({
        suggestions
      });
    }
  }catch(error){
    console.error(
      "Goobrow suggestions failed:",
      error.message
    );
  }

  res.json({
    suggestions:[]
  });
});


app.get("/api/images", async (req,res)=>{
  const query = String(req.query.q || "").trim();

  if(!query){
    return res.json({
      engine:"Goobrow Images",
      query:"",
      totalResults:0,
      page:1,
      pageSize:30,
      totalPages:0,
      results:[]
    });
  }

  try{
    const url =
      "https://www.bing.com/images/search?q=" +
      encodeURIComponent(query);

    const response = await fetch(url,{
      headers:{
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/139 Mobile Safari/537.36"
      }
    });

    if(!response.ok){
      throw new Error(
        "Image search returned HTTP " + response.status
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];
    const seen = new Set();

    /*
     * Bing image results contain JSON objects inside
     * attributes such as m.
     */
    $(".iusc").each((i,el)=>{
      if(results.length >= 30) return;

      const raw = $(el).attr("m");
      if(!raw) return;

      try{
        const data = JSON.parse(raw);

        const image =
          data.murl ||
          data.turl ||
          "";

        const thumbnail =
          data.turl ||
          data.murl ||
          "";

        const title =
          data.t ||
          data.desc ||
          query;

        const source =
          data.purl ||
          data.murl ||
          "";

        if(
          image &&
          !seen.has(image)
        ){
          seen.add(image);

          results.push({
            title,
            image,
            thumbnail,
            source
          });
        }
      }catch{}
    });

    /*
     * Fallback parser for Bing layouts that expose
     * image URLs directly in the page.
     */
    if(results.length === 0){
      $("a.iusc").each((i,el)=>{
        if(results.length >= 30) return;

        const raw = $(el).attr("m");
        if(!raw) return;

        try{
          const data = JSON.parse(raw);

          if(data.murl && !seen.has(data.murl)){
            seen.add(data.murl);

            results.push({
              title:data.t || query,
              image:data.murl,
              thumbnail:data.turl || data.murl,
              source:data.purl || data.murl
            });
          }
        }catch{}
      });
    }

    return res.json({
      engine:"Goobrow Images",
      query,
      totalResults:results.length,
      page:1,
      pageSize:30,
      totalPages:Math.max(
        1,
        Math.ceil(results.length / 30)
      ),
      results
    });

  }catch(error){
    console.error(
      "Goobrow image search failed:",
      error.message
    );

    return res.status(502).json({
      engine:"Goobrow Images",
      query,
      totalResults:0,
      page:1,
      pageSize:30,
      totalPages:0,
      results:[],
      error:"Image search is temporarily unavailable."
    });
  }
});



app.post("/api/ai", async (req,res)=>{
  const query = String(req.body?.query || "").trim();

  if(!query){
    return res.status(400).json({
      error:"Please enter a question."
    });
  }

  if(!process.env.OPENAI_API_KEY){
    return res.status(503).json({
      error:"Goobrow AI is not configured yet."
    });
  }

  try{
    const OpenAI = require("openai");
    const client = new OpenAI({
      apiKey:process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model:"gpt-5.6",
      input:
        "You are Goobrow AI. Answer the user's question clearly, accurately, and concisely. " +
        "Do not claim to be Google. Explain that you are Goobrow AI powered by OpenAI when relevant.\n\n" +
        "User question: " + query
    });

    res.json({
      engine:"Goobrow AI",
      query,
      answer:response.output_text || ""
    });

  }catch(error){
    console.error("Goobrow AI failed:",error.message);

    res.status(500).json({
      error:"Goobrow AI could not generate an answer right now."
    });
  }
});



app.get("/api/news", async (req,res)=>{
  const query =
    String(req.query.q || "latest Nigeria news").trim() ||
    "latest Nigeria news";

  try{
    const rssUrl =
      "https://news.google.com/rss/search?q=" +
      encodeURIComponent(query) +
      "&hl=en-NG&gl=NG&ceid=NG:en";

    const response = await fetch(rssUrl,{
      headers:{
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36",
        "Accept":
          "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8"
      }
    });

    if(!response.ok){
      throw new Error(
        "Google News returned HTTP " + response.status
      );
    }

    const xml = await response.text();

    if(!xml || xml.length < 300){
      throw new Error("Google News returned an empty response");
    }

    const $ = cheerio.load(xml,{
      xmlMode:true
    });

    const results = [];
    const seen = new Set();

    function clean(value){
      return String(value || "")
        .replace(/<!\[CDATA\[/g,"")
        .replace(/\]\]>/g,"")
        .replace(/<[^>]*>/g," ")
        .replace(/&amp;/g,"&")
        .replace(/&quot;/g,'"')
        .replace(/&#39;/g,"'")
        .replace(/&apos;/g,"'")
        .replace(/&lt;/g,"<")
        .replace(/&gt;/g,">")
        .replace(/&nbsp;/g," ")
        .replace(/\s+/g," ")
        .trim();
    }

    function absoluteUrl(value, base){
      try{
        return new URL(value, base).href;
      }catch{
        return "";
      }
    }

    async function findArticleImage(articleUrl){
      if(!articleUrl) return "";

      try{
        const page = await fetch(articleUrl,{
          headers:{
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36",
            "Accept":
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          redirect:"follow"
        });

        if(!page.ok){
          return "";
        }

        const html = await page.text();

        if(!html || html.length < 500){
          return "";
        }

        const $page = cheerio.load(html);

        const candidates = [
          $page('meta[property="og:image"]').attr("content"),
          $page('meta[property="og:image:url"]').attr("content"),
          $page('meta[name="twitter:image"]').attr("content"),
          $page('meta[name="twitter:image:src"]').attr("content"),
          $page('link[rel="image_src"]').attr("href")
        ];

        for(const candidate of candidates){
          const image = absoluteUrl(candidate, page.url || articleUrl);
          if(image){
            return image;
          }
        }

        let fallback = "";

        $page("img").each(function(){
          if(fallback) return;

          const src =
            $page(this).attr("src") ||
            $page(this).attr("data-src") ||
            $page(this).attr("data-lazy-src") ||
            "";

          const image = absoluteUrl(
            src,
            page.url || articleUrl
          );

          if(
            image &&
            !image.startsWith("data:") &&
            !image.includes("logo") &&
            !image.includes("icon") &&
            !image.includes("avatar") &&
            !image.includes("sprite")
          ){
            fallback = image;
          }
        });

        return fallback;

      }catch(error){
        console.log(
          "Article image lookup failed:",
          articleUrl,
          error.message
        );
        return "";
      }
    }

    const items = [];

    $("item").each(function(){
      if(items.length >= 12) return false;

      const item = $(this);

      const title =
        clean(item.find("title").first().text());

      const link =
        clean(item.find("link").first().text());

      const descriptionRaw =
        item.find("description").first().text() || "";

      const description =
        clean(descriptionRaw);

      const pubDate =
        clean(item.find("pubDate").first().text());

      const source =
        clean(item.find("source").first().text()) ||
        "Google News";

      let image =
        item.find("media\\:content").first().attr("url") ||
        item.find("media\\:thumbnail").first().attr("url") ||
        item.find("enclosure").first().attr("url") ||
        "";

      if(
        !title ||
        !link ||
        seen.has(link)
      ){
        return;
      }

      seen.add(link);

      items.push({
        title,
        url:link,
        link,
        description,
        source,
        publisher:source,
        image,
        imageUrl:image,
        thumbnail:image,
        publishedAt:pubDate,
        video:false
      });
    });

    /*
      Google News RSS often does not expose the publisher image.
      Only look up article pages for stories that need an image.
    */
    for(const story of items){

      if(story.image){
        continue;
      }

      story.image =
        await findArticleImage(story.url);

      story.imageUrl =
        story.image;

      story.thumbnail =
        story.image;

    }

    results.push(...items);

    console.log(
      "Google News:",
      query,
      "->",
      results.length,
      "stories"
    );

    console.log(
      "News images:",
      results.filter(x => x.image).length,
      "/",
      results.length
    );

    res.json({
      engine:"Google News",
      query,
      count:results.length,
      results
    });

  }catch(error){

    console.error(
      "Goobrow Google News failed:",
      error.message
    );

    res.status(200).json({
      engine:"Google News",
      query,
      count:0,
      results:[],
      error:"Google News is temporarily unavailable"
    });

  }
});

app.get("/api/videos", async (req,res)=>{
  const query=String(req.query.q||"").trim();

  if(!query){
    return res.json({
      engine:"Goobrow Videos",
      query:"",
      results:[]
    });
  }

  try{
    const url="https://www.bing.com/videos/search?q="+encodeURIComponent(query);

    const response=await fetch(url,{
      headers:{
        "User-Agent":"Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36"
      }
    });

    if(!response.ok){
      throw new Error("Bing request failed: "+response.status);
    }

    const html=await response.text();

    const results=[];
    const seen=new Set();

    const clean=x=>String(x||"")
      .replace(/<[^>]*>/g," ")
      .replace(/&amp;/g,"&")
      .replace(/&quot;/g,'"')
      .replace(/&#39;/g,"'")
      .replace(/&nbsp;/g," ")
      .replace(/&#x27;/g,"'")
      .replace(/\s+/g," ")
      .trim();

    // Extract each Bing video card.
    const cardRegex=/<div[^>]+id=["']mc_vtvc_video_[^"']+["'][\s\S]*?<\/div><\/div><\/a><\/div>/gi;

    let match;

    while((match=cardRegex.exec(html))!==null){

      if(results.length>=12) break;

      const block=match[0];

      // Bing provides the actual destination as "ourl".
      const urlMatch=block.match(
        /ourl=["'](https?:\/\/[^"']+)["']/i
      );

      // Also accept murl/pgurl from the embedded metadata.
      const metaMatch=block.match(
        /"murl":"(https?:\/\/[^"]+)"/i
      );

      const pgMatch=block.match(
        /"pgurl":"(https?:\/\/[^"]+)"/i
      );

      let videoUrl=
        urlMatch?.[1] ||
        metaMatch?.[1] ||
        pgMatch?.[1] ||
        "";

      videoUrl=clean(videoUrl);

      if(!videoUrl) continue;

      // Extract title.
      const titleMatch=block.match(
        /class=["'][^"']*mc_vtvc_title[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
      );

      let title=titleMatch ? clean(titleMatch[1]) : "";

      if(!title){
        const aria=block.match(
          /aria-label=["']([^"']+)["']/i
        );

        if(aria){
          title=clean(aria[1])
            .replace(/\s*[·•].*$/,"")
            .trim();
        }
      }

      if(!title) title="Video";

      // Extract the high-quality Bing thumbnail.
      const imageMatch=
        block.match(/data-src-hq=["'](https?:\/\/[^"']+)["']/i) ||
        block.match(/src=["'](https?:\/\/[^"']+)["']/i) ||
        block.match(/"turl":"(https?:\/\/[^"]+)"/i);

      let image=imageMatch ? clean(imageMatch[1]) : null;

      if(image){
        image=image.replace(/&amp;/g,"&");
      }

      const key=videoUrl+"|"+title;

      if(seen.has(key)) continue;

      seen.add(key);

      results.push({
        title,
        url:videoUrl,
        image
      });
    }

    res.json({
      engine:"Goobrow Videos",
      query,
      results
    });

  }catch(error){

    console.error(
      "Goobrow video search failed:",
      error.message
    );

    res.json({
      engine:"Goobrow Videos",
      query,
      results:[]
    });
  }
});


app.get("/api/page-image",async(req,res)=>{
  const url=String(req.query.url||"").trim();

  if(!url){
    return res.status(400).json({error:"Missing URL"});
  }

  const image=await goobrowFetchImage(url);

  res.json({
    url,
    image:image||null
  });
});



// GOOBROW HOMEPAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "www", "index.html"));
});


// GOOBROW RESULTS PAGE
app.get("/results.html", (req, res) => {
  res.sendFile(path.join(__dirname, "www", "results.html"));
});


/* =====================================================
   GOOBROW ACADEMIC SEARCH
   ===================================================== */

function goobrowAcademicSubject(q){
  const x=String(q||'').toLowerCase();

  if(/\b(biology|cell|dna|rna|gene|photosynthesis|respiration|ecosystem|organism|anatomy|physiology|mitosis|meiosis|genetics)\b/.test(x)) return 'Biology';
  if(/\b(chemistry|chemical|atom|molecule|element|periodic|acid|base|salt|reaction|equation|compound|oxidation)\b/.test(x)) return 'Chemistry';
  if(/\b(physics|force|motion|velocity|acceleration|energy|power|work|momentum|electricity|voltage|current|wave|light|pressure|density|gravity)\b/.test(x)) return 'Physics';
  if(/\b(math|mathematics|calculate|calculation|equation|algebra|geometry|fraction|percentage|ratio|probability|statistics|trigonometry|quadratic|factorial|integral|derivative)\b/.test(x)) return 'Mathematics';
  if(/\b(english|grammar|noun|pronoun|verb|adjective|adverb|tense|sentence|literature|comprehension|synonym|antonym|punctuation|vocabulary)\b/.test(x)) return 'English';
  if(/\b(geography|climate|weather|map|population|continent|earthquake|volcano|river|soil|latitude|longitude)\b/.test(x)) return 'Geography';
  if(/\b(history|historical|war|colonial|independence|civilization|government|civics|democracy|constitution)\b/.test(x)) return 'History/Civic';
  if(/\b(computer|programming|coding|algorithm|software|hardware|database|internet|javascript|python|html|css)\b/.test(x)) return 'Computer Science';

  return 'General Academics';
}

function goobrowSafeCalculate(expr){
  let x=String(expr||'')
    .replace(/,/g,'')
    .replace(/[×x]/g,'*')
    .replace(/÷/g,'/')
    .replace(/\^/g,'**')
    .trim();

  if(!x || x.length>100) return null;
  if(!/^[0-9+*/().%\s-]+$/.test(x)) return null;
  if(x.includes('**')) return null;

  try{
    const result=Function('"use strict"; return ('+x+')')();
    if(typeof result!=='number' || !Number.isFinite(result)) return null;
    return Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
  }catch{
    return null;
  }
}

app.get('/api/academic', async (req,res)=>{
  const query=String(req.query.q||'').trim();

  if(!query){
    return res.json({
      subject:'General Academics',
      type:'academic',
      answer:'Please enter an academic question.',
      results:[]
    });
  }

  const subject=goobrowAcademicSubject(query);
  const calculation=goobrowSafeCalculate(query);

  if(calculation!==null){
    return res.json({
      subject:'Mathematics',
      type:'calculation',
      answer:query+' = '+calculation,
      results:[]
    });
  }

  let results=[];

  try{
    const url='https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=8&srsearch='+encodeURIComponent(query);
    const response=await fetch(url,{
      headers:{'User-Agent':'GoobrowAcademic/1.0'}
    });

    if(response.ok){
      const data=await response.json();

      for(const item of (data.query?.search||[])){
        const title=item.title||'';
        const description=String(item.snippet||'')
          .replace(/<[^>]*>/g,'')
          .replace(/&quot;/g,'"')
          .replace(/&#39;/g,"'")
          .replace(/&amp;/g,'&');

        results.push({
          title:title,
          url:'https://en.wikipedia.org/wiki/'+encodeURIComponent(title.replace(/ /g,'_')),
          description:description
        });
      }
    }
  }catch(error){
    console.error('Academic search:',error.message);
  }

  res.json({
    subject:subject,
    type:'academic',
    answer:results.length ? 'Academic results for: '+query : 'No academic results were found. Try rephrasing your question.',
    results:results
  });
});


/* GOOBROW ACADEMIC SUPER ROUTE */
app.get("/api/academic-super",(req,res)=>{
  const query=String(req.query.q||"").trim();
  if(!query) return res.json({ok:false,message:"Please enter an academic topic."});

  const visual=goobrowAcademicVisual(query);

  if(!visual){
    return res.json({
      ok:true,
      found:false,
      question:query,
      message:"No built-in visual topic matched this search yet."
    });
  }

  res.json({
    ok:true,
    found:true,
    question:query,
    visual
  });
});



/* GOOBROW VISUAL LEARNING ROUTE */

app.get("/api/visual-learning",(req,res)=>{
  const query=String(req.query.q||"").trim();

  if(!query){
    return res.json({
      ok:false,
      message:"Please enter a topic."
    });
  }

  const visual=goobrowVisualLearningTopic(query);

  if(!visual){
    return res.json({
      ok:true,
      found:false,
      question:query,
      message:"No built-in visual lesson matched this topic yet."
    });
  }

  res.json({
    ok:true,
    found:true,
    question:query,
    visual
  });
});

/* END GOOBROW VISUAL LEARNING ROUTE */



/* GOOBROW DOWNLOAD MANAGER SERVER */

app.get("/api/download-check",(req,res)=>{
  const url=String(req.query.url||"").trim();

  if(!url){
    return res.json({
      ok:false,
      downloadable:false,
      message:"No media URL supplied."
    });
  }

  try{
    const parsed=new URL(url);

    if(!["http:","https:"].includes(parsed.protocol)){
      return res.json({
        ok:false,
        downloadable:false,
        message:"Unsupported URL protocol."
      });
    }

    const host=parsed.hostname.toLowerCase();

    if(
      host.includes("youtube.com") ||
      host.includes("youtu.be") ||
      host.includes("youtube-nocookie.com")
    ){
      return res.json({
        ok:true,
        downloadable:false,
        platform:"youtube",
        message:"YouTube downloads are not handled by Goobrow. Open the video on YouTube to use YouTube's supported options."
      });
    }

    return res.json({
      ok:true,
      downloadable:true,
      url,
      message:"Direct media URL detected."
    });

  }catch(error){

    return res.json({
      ok:false,
      downloadable:false,
      message:"Invalid media URL."
    });

  }
});

/* END GOOBROW DOWNLOAD MANAGER SERVER */


app.listen(PORT, () => {
  console.log(`Goobrow search server running at http://localhost:${PORT}`);
});
