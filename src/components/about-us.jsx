import anijaImage from '../aboutUs-images/IMG_2940.png';

const AboutUsPage = () => {
  return(
    <>
      <h1>Read All About Us!</h1>
      <h3 id="aboutUsH3">Anija-Khallil Robinson</h3>
      <img src={anijaImage} alt="Anija-Khallil" height="500vh" className='anijaImage'/>
       <p id='about-p'>
          Hello! my name is Anija-Khallil Robinson, an aspiring software engineer with a love for problem solving and creativity.
          I was born and raised in Syracuse, NY where early on I was surrounded by
          sports and music and developed a passion for both. Raised around computer
          savvy family members I later grew an interest towards tech without even realizing.
          Starting out mixing and recording audio, producing, and setting up studio equipment.
          I offer creative solutions, I love thinking outside of the box.
          I’m committed to supporting and encouraging my teammates in anyway that I can.
          I pride myself on not only being a great colleague but an even greater friend.

      </p>



    </>
  );
}
export default AboutUsPage;
