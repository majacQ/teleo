import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import posed from 'react-pose';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import history from '../history';
import { ui } from '../constants';

const crslItems = [
  {
    title: 'Contextualize the role of immunization',
    desc: 'Explore the extended network of risk factors associated with measles infection in children by contextualizing immunization alongside other potential interventions.',
    index: 1
  },
  {
    title: 'Example 2',
    desc: '(description for example 2)',
    index: 2
  },
  {
    title: 'Example 3',
    desc: '(description for example 3)',
    index: 3
  }
];

const PosedDiv = posed.div({
  state1: { left: 122 + 800 * -2 },
  state2: { left: 122 + 800 * -1 },
  state3: { left: 122 + 800 * -0 },
  state4: { left: 122 + 800 * 1 },
  state5: { left: 122 + 800 * 2 }
  // visible: { left: prps => 122 + (800 * (prps.i - curCrsl)) }
});

const Home = ({
  windowSize
}) => {
  const [curCrsl, setCurCrsl] = useState(0);
  return (
    <div>
      <div className="header-wrapper" style={{ height: ui.header.height, width: windowSize.width }}>
        <div className="header" style={{ height: ui.header.height, width: windowSize.appWidth, left: windowSize.appLeft }}>
          <div className="header-text">
            Seminal Events Timeline
          </div>
          <div className="header-icons">
            <Button
              variant="outlined"
              className="home-header-button"
              classes={{ label: 'home-header-button', root: 'home-header-button-outline' }}
              onClick={() => history.replace('/app')}
            >
              Build a Visualization
            </Button>
            {/* <span
              className="header-icon icon-search2"
              onClick={() => setSearchOpen(!searchOpen)}
              role="presentation"
            /> */}
          </div>
        </div>
      </div>
      <div
        className="home-container"
        style={{
          width: windowSize.width,
          top: ui.header.height,
          height: windowSize.height - ui.header.height
        }}
      >
        <div
          className="home-image"
          style={{
            height: 420,
            marginLeft: windowSize.appLeft,
            width: windowSize.appWidth
          }}
        >
          <div className="home-image-text">
            <div className="home-image-text-welcome">
              Welcome to the
            </div>
            <div className="home-image-text-set">
              Seminal Events Timeline
            </div>
            <div className="home-image-text-desc">
              Explore the biological mechanisms of global health problems through seminal events
              of human development from conception to thirteen years of age.
            </div>
          </div>
        </div>
        <div className="home-buildvis">
          <div className="home-buildvis-inner" style={{ paddingLeft: windowSize.appLeft }}>
            <div className="home-buildvis-text">Build a visualization</div>
            <IconButton
              classes={{ root: 'home-carousel-button-root' }}
              className="home-buildvis-button"
              aria-label="build"
              onClick={() => history.replace('/app')}
            >
              <ArrowForwardIcon />
            </IconButton>
          </div>
        </div>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#F1F2F2"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image1" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">1</div>
            <div className="home-instructions-header">Add Variables</div>
            <div className="home-instructions-text">
              Add categories of events from development across organogenesis,
              growth and maturation, and neurodevelopment.
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#FFFFFF"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image2" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">2</div>
            <div className="home-instructions-header">Search Causal Pathways</div>
            <div className="home-instructions-text">
              Search for specific health outcomes, risk factors, and interventions
              and see causal pathways of how a particular event is related to others.
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#F1F2F2"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image3" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">3</div>
            <div className="home-instructions-header">Select Age range</div>
            <div className="home-instructions-text">
              See specific periods of development by narrowing the time period of development
              from conception to age 13 years. Adjust by dragging sliders on the timeline
              or selecting a pre-specified range.
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#FFFFFF"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image4" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">4</div>
            <div className="home-instructions-header">View Details</div>
            <div className="home-instructions-text">
              Expand events to view detailed descriptions, peak ages, detailed references,
              and causal pathway diagrams.
            </div>
          </Box>
        </Box>
        <div
          className="home-carousel-container"
          style={{
            paddingLeft: windowSize.appLeft,
            paddingRight: windowSize.appLeft,
            width: windowSize.appWidth
          }}
        >
          <div className="home-carousel-header">Get started with an example visualization</div>
          <div
            className="home-carousel-box"
            style={{ width: windowSize.appWidth }}
          >
            <PosedDiv pose={`state${3 - curCrsl}`} className="home-carousel-item">
              <div className="home-carousel-item-title">{crslItems[0].title}</div>
              <div className="home-carousel-item-desc">{crslItems[0].desc}</div>
            </PosedDiv>
            <PosedDiv pose={`state${4 - curCrsl}`} className="home-carousel-item">
              <div className="home-carousel-item-title">{crslItems[1].title}</div>
              <div className="home-carousel-item-desc">{crslItems[1].desc}</div>
            </PosedDiv>
            <PosedDiv pose={`state${5 - curCrsl}`} className="home-carousel-item">
              <div className="home-carousel-item-title">{crslItems[2].title}</div>
              <div className="home-carousel-item-desc">{crslItems[2].desc}</div>
            </PosedDiv>
            { curCrsl > 0 && (
              <div className="home-carousel-button-left">
                <IconButton
                  className="home-carousel-button"
                  aria-label="carousel-left"
                  classes={{ root: 'home-carousel-button-root' }}
                  onClick={() => setCurCrsl(Math.max(0, curCrsl - 1))}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
            )}
            { curCrsl < crslItems.length - 1 && (
              <div className="home-carousel-button-right">
                <IconButton
                  className="home-carousel-button"
                  aria-label="carousel-right"
                  classes={{ root: 'home-carousel-button-root' }}
                  onClick={() => setCurCrsl(Math.min(crslItems.length - 1, curCrsl + 1))}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>
        <div
          className="home-methodology"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <div className="home-methodology-text">Read about the methodology</div>
          <IconButton
            className="home-methodology-button"
            aria-label="build"
            // onClick={() => history.replace('/methodology')}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
        {/* <Box
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}        
        >
          <div className="home-info-header">Supported By</div>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          className="home-info"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}        
        >
          <Box flexBasis={0} flexGrow={1} className="home-info-column">
            <div className="home-info-logo">
              <img src="images/bmgf.png" alt="bmgf" width="250px" />
            </div>
            <div>
              <p>
                Guided by the belief that every life has equal value, the Bill & Melinda
                Gates Foundation works to help all people lead healty, productive lives.
                In developing countries, it focuses on improving people&apos;s health and
                giving them the chance to lift themselves out of hunger and extreme
                poverty. In the United States, it seeks to ensure that all people -
                especially those with the fewest resources - have access to the
                opportunities they need to succeed in school and life.
              </p>
            </div>
          </Box>
          <Box flexBasis={0} flexGrow={1} className="home-info-column">
            <div className="home-info-logo">
              Healthy Birth,
              <br />
              Growth, & Development
            </div>
            <div>
              <p>
                In 2013, the Bill & Melinda Gates Foundation created the Health Birth, Growth,
                and Development program (HBGD) to ensure that all children can regain control
                of their futures, maximize their potential, and have the opportunity to lead
                a healty and productive life.
              </p>
              <p>
                HBGD intends to fill the key knowledge gaps in the field the prevent us from
                knowing how to use our scarce resources to intervene effectively. HBGD is
                organized around a list of key questions, and the answers to these questions
                will help the Foundation and its partners cut through some of the complexity
                and start to reduce the heavy burden of preterm birth, stunting, and
                neurocognitive impairment.
              </p>
            </div>
          </Box>
          <Box flexBasis={0} flexGrow={1} className="home-info-column">
            <div className="home-info-logo">
              <img src="images/hbgdki.png" alt="hbgdki" width="150px" />
            </div>
            <div>
              <p>
                Within HBGD, the knowledge integration initiative (HBGDki) aims to answer the
                key questions by analyzing the large body of data that already exists.
              </p>
              <p>
                Researchers have been studying birth, growth, and development for decades, but
                most of the data they&apos;ve collected are stored on hard drives or in file
                cabinets where no one has access to them. HBGDki has brought a lot of these
                data together in a large and diverse knowledge base. HBGDki is visualizing and
                analyzing the data using state-of-the-art analysis methods and tools to
                generate new insights that will help us answer the key questions.
              </p>
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          className="home-footer"
        >
          <Box flexGrow={1}>
            &copy; 2019 Bill & Melinda Gates Foundation. All Rights Reserved.
          </Box>
          <Box className="home-footer-text">
            Terms of Service
          </Box>
          <Box className="home-footer-text">
            Privacy Policy
          </Box>
          <Box className="home-footer-text">
            Methodology
          </Box>
          <Box className="home-footer-text">
            Contact Us
          </Box>
        </Box> */}
      </div>
    </div>
  );
};

Home.propTypes = {
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  windowSize: state.windowSize
});

// const mapDispatchToProps = dispatch => ({
// });

export default connect(
  mapStateToProps
  // mapDispatchToProps,
)(Home);
