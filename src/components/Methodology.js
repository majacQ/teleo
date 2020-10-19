import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import HeaderNonApp from './HeaderNonApp';
import Footer from './Footer';
import { ui } from '../constants';

const Methodology = ({
  windowSize
}) => (
  <div>
    <HeaderNonApp />
    <div
      className="methodology-container"
      style={{
        width: windowSize.width,
        top: ui.header.height,
        minHeight: windowSize.height - ui.header.height - 116
      }}
    >
      <div className="methodology-inner">
        <div className="methodology-title">Methods</div>
        <div className="methodology-subtitle">Last updated September 28, 2017</div>
        <div className="methodology-header">
          Background and purpose of the Early Life Events and Outcomes Resource
        </div>
        <div className="methodology-text">
          The Early Life Events and Outcomes Resource (ELEnOR)
          stems from the Knowledge Integration (Ki) initiative of the
          Bill & Melinda Gates Foundation. In developing ELEnOR, the overarching goal was
          to create a detailed map linking key events in normal organogenesis, growth and
          maturation; cognitive, language, emotional, and motor development; health
          conditions that may interrupt normal growth; and interventions that could improve
          outcomes. ELEnOR was built to facilitate cross-disciplinary collaboration,
          hypothesis development, and predictive modeling to improve our understanding of
          child growth and development. In collaboration with Cognition Studio, this tool is
          prototyped as an interactive, online digital resource, oriented toward the needs
          of researchers, policy makers, and implementation strategists who work to
          understand and support improved childhood health outcomes.
        </div>
        <div className="methodology-header">
          Key principles of data structure and inclusion
        </div>
        <div className="methodology-text">
          To align with Ki goals of answering key questions about preterm birth, growth
          faltering, and impaired neurocognitive development (1), we emphasized health
          outcomes of key importance in low- and middle-income countries using a global
          burden of disease tool (2). A list of health outcomes was derived from this
          source, iteratively reviewed, and expanded to increase breadth and include
          information about specific interests of the Ki team. Interventions were
          included based on empirical evidence of efficacy in peer-reviewed studies.
          Implementation feasibility was a key consideration for inclusion of interventions
          in ELEnOR. Interventions deemed impractical in low- and middle-income countries,
          such as some types of cancer chemotherapy or expensive diagnostics, were excluded.
        </div>
        <div className="methodology-header">
          Literature review process
        </div>
        <div className="methodology-text">
          A literature review was performed by the University of Washington’s (UW’s) START
          Center in the Department of Global Health, in collaboration with the Ki
          initiative. Development of ELEnOR began in September 2015 and has continued to
          the present. To develop ELEnOR, a review was conducted by researchers in
          epidemiology and clinical practitioners.  Specific resources searched by the team
          included medical textbooks, online resources, and peer-reviewed articles about
          human growth and development, focusing on major events and processes related to
          development from conception through adolescence.
          <br />
          <br />
          The primary aim of providing a holistic view of human growth and development from
          conception to adolescence was too broad a topic to be addressed using a formal
          systematic review. Thus, an alternative approach was developed to collect and
          synthesize these data. First, the UW team created a preliminary proposal of data
          collection procedures, organizational structure and data categories. This
          proposal was then reviewed and refined by UW and Ki leadership. Second, the
          UW team collected detailed content for inclusion in ELEnOR. These data were
          iteratively reviewed by the team for accuracy and completeness. Final decisions
          about retention versus exclusion of specific content were reached by consensus
          between the UW researchers and Ki leaders.
        </div>
        <div className="methodology-header">
          Organization of ELEnOR
        </div>
        <div className="methodology-text">
          Time period. The integrated timeline spans the developmental period from
          conception to age 13 years. This interval was divided into 2 developmental
          periods including conception-prenatal (gestational age, 0-40 wk), and
          birth-adolescence (postnatal age ≥ 0-13 y).
          <br />
          <br />
          Data categories. Detailed content was divided into 3 sections that included 18
          categories: 10 organ systems (central nervous system, peripheral nervous system,
          respiratory, cardiovascular, gastrointestinal, blood/immune, musculoskeletal,
          genitourinary, endocrine, integument), 4 developmental domains (motor, language,
          cognitive, emotional), and 4 categories related to health (specific health
          outcomes, pathogenesis, risk factors, and interventions).
          <br />
          <br />
          Key definitions. To ensure consistency of data categorization and classification,
          the following terms were defined:
          <ul className="methodology-list">
            <li>
              Normal pregnancies were defined as full term births ending at 40 weeks&apos;
              gestation.
            </li>
            <li>
              Age range was categorized in the literature as the span between documented
              possible start age and end age, with the inclusion of any application peak age
              (i.e. T-cell populations increase in number between week 19 following
              conception to postnatal 9 month, with peak rate at postnatal 6 month).
            </li>
            <li>
              Interventions were divided into two groups: 1) Interventions that were
              expected to have a direct impact on risk factors that were included in
              ELEnOR; 2) Interventions that that were not considered to directly impact risk
              factors in ELEnOR. These risk factors could have a direct or indirect impact
              on a health outcome. For example, pneumococcal conjugate vaccine (PCV) is
              noted to have an indirect impact on pneumococcal pneumonia via the pathway
              mediated by adult smoking.
            </li>
          </ul>
        </div>
        <div className="methodology-header">
          Comprehensive ELEnOR Dataset
        </div>
        <div className="methodology-text">
          Drawing from 859 references identified in the literature review, the dataset used
          to generate the ELEnOR digitization includes:
          <ul className="methodology-list">
            <li>
              543 Organogenesis events
            </li>
            <li>
              296 Growth & Maturation events
            </li>
            <li>
              686 Development Domain events
            </li>
            <li>
              2,355 pathways connecting: 33 Health outcomes, 49 Pathogeneses, 222 Risk
              Factors, 199 Interventions
            </li>
          </ul>
        </div>
        <div className="methodology-download-button">
          <Button
            href="elenor_data.xlsx"
            startIcon={<GetAppIcon />}
            classes={{ label: 'download-button', root: 'download-button-outline' }}
          >
            Download Dataset (.xls)
          </Button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

Methodology.propTypes = {
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  windowSize: state.windowSize
});

// const mapDispatchToProps = dispatch => ({
// });

export default connect(
  mapStateToProps
  // mapDispatchToProps,
)(Methodology);
