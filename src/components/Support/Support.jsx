import React from 'react';
import GoldSponsors from './support-goldsponsors.json';
import SilverSponsors from './support-silversponsors.json';
import Sponsors from './support-sponsors.json';
import Backers from './support-backers.json';
import Additional from './support-additional.js';
import './Support.scss';

const ranks = {
  backer: {
    maximum: 200
  },
  bronze: {
    minimum: 200,
    maximum: 2000
  },
  silver: {
    minimum: 2000,
    maximum: 10000
  },
  gold: {
    minimum: 10000,
    maximum: 50000
  },
  platinum: {
    minimum: 50000
  }
};

function formatMoney(number) {
  let str = Math.round(number) + '';
  if (str.length > 3) {
    str = str.substr(0, str.length - 3) + ',' + str.substr(-3);
  }
  return str;
}

export default class Support extends React.Component {
  render() {
    let { rank } = this.props;
    let supporters = [
      ...GoldSponsors,
      ...SilverSponsors,
      ...Sponsors,
      ...Backers,
    ];

    // merge or add additional backers/sponsors
    for(const additional of Additional) {
      const existing = supporters.find(supporter => supporter.username && supporter.username === additional.username);
      if (existing) {
        existing.totalDonations += additional.totalDonations;
      } else {
        supporters.push(additional);
      }
    }

    // resort list
    supporters.sort((a, b) => b.totalDonations - a.totalDonations);

    let minimum, maximum;

    if (rank && ranks[rank]) {
      minimum = ranks[rank].minimum;
      maximum = ranks[rank].maximum;
    }

    if (typeof minimum === 'number') {
      supporters = supporters.filter(item => item.totalDonations >= minimum * 100);
    }

    if (typeof maximum === 'number') {
      supporters = supporters.filter(item => item.totalDonations < maximum * 100);
    }

    return (
      <div className="support">
        <div className="support__description">
          { rank === 'backer' ? (
            <p>
              The following <b>Backers</b> are individuals who have contributed various amounts of money in order to help support webpack. Every little bit helps, and we appreciate even the smallest contributions.
            </p>
          ) : (
            <p>
              <b className="support__rank">{ rank } sponsors</b>
              <span>are those who have pledged { minimum ? `$${formatMoney(minimum)}` : 'up' } { maximum ? `to $${formatMoney(maximum)}` : 'or more' } to webpack.</span>
            </p>
          )}
        </div>

        {
          supporters.map((supporter, index) => (
            <a key={ supporter.id || supporter.username || index }
               className="support__item"
               title={ `$${formatMoney(supporter.totalDonations / 100)} by ${supporter.name || supporter.username}` }
               target="_blank"
               href={ supporter.website || `https://opencollective.com/${supporter.username}` }>
              { supporter.avatar ? <img
                className={ `support__${rank}-avatar` }
                src={ supporter.avatar }
                alt={ supporter.username ? `${supporter.username}'s avatar` : 'avatar' } /> :
                supporter.name }
              { rank === 'backer' ? <figure className="support__outline" /> : null }
            </a>
          ))
        }

        <div className="support__bottom">
          <a className="support__button" href="https://opencollective.com/webpack#support">
            Become a { rank === 'backer' ? 'backer' : 'sponsor' }
          </a>
        </div>
      </div>
    );
  }
}
