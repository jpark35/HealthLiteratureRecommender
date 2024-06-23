import React, { useState } from 'react';
import axios from 'axios';
import './healthData.css';

const HealthData = () => {

  // user input handling:
  const [user_age, setAge] = useState('');
  const [user_sex, setSex] = useState('');
  const [user_pregnant, setPregnant] = useState('No');
  const [user_tobaccoUse, setTobaccoUse] = useState('No');
  const [user_sexuallyActive, setSexuallyActive] = useState('No');

  // resource handling:
  const [allResources, setAllResources] = useState([]);
  const [interestResources, setInterestResources] = useState([]);
  const [pregnantResources, setPregnantResources] = useState([]);
  const [someResources, setSomeResources] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // error handling: 
  const [error, setError] = useState(null);
  const [error_field, setErrorField]  = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // username and password handling:
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  const handleRegister = async () => {

    try {
      await axios.post('http://localhost:3002/register', { username, password });
      alert('User registration successful! Proceed by logging in.');
    } catch (error) {
      alert('User registration failed!');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3002/login', { username, password });
      setToken(response.data.token);
      alert('User successfully logged in! Take a look at all the health literature and resources available.');
    } catch (error) {
      alert('User login failed!');
    }
  };

  const handleSubmit = async (e) => {

  e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorField(null);
    setFormSubmitted(false);

    // validate required fields: age and sex
    if (!user_age || !user_sex) {
      setErrorField({ message: 'Age and Sex are required fields' });
      setLoading(false);
      return;
    }

    // converting yes/no user responses to 1/0
    const pregnantValue = user_pregnant.toLowerCase() === 'yes' ? 1 : 0;
    const tobaccoUseValue = user_tobaccoUse.toLowerCase() === 'yes' ? 1 : 0;
    const sexuallyActiveValue = user_sexuallyActive.toLowerCase() === 'yes' ? 1 : 0;

    // DEBUG: log the parameters being sent
    console.log('Parameters:', {
      age: user_age,
      sex: user_sex,
      pregnant: pregnantValue,
      tobaccoUse: tobaccoUseValue,
      sexuallyActive: sexuallyActiveValue,
      lang: 'en',
    });

    try {
      const response = await axios.get('https://health.gov/myhealthfinder/api/v3/myhealthfinder.json', {
        params: {
          age: user_age,
          sex: user_sex,
          pregnant: pregnantValue,
          tobaccoUse: tobaccoUseValue,
          sexuallyActive: sexuallyActiveValue,
          lang: 'en',
        },
      });

      const payload = { response };
      // console.log('Payload response size:', new Blob([JSON.stringify(payload)]).size);
      
      setAllResources(response.data.Result.Resources.all?.Resource || []);
      setInterestResources(response.data.Result.Resources["You may also be interested in these health topics:"]?.Resource || []);
      setPregnantResources(response.data.Result.Resources.pregnant?.Resource || []);
      setSomeResources(response.data.Result.Resources.some?.Resource || []);

      setFormSubmitted(true);

      if (token) {
        await axios.post('http://localhost:3002/query', { query: JSON.stringify(response.data) }, {
          headers: { Authorization: token }
        });
      }

      // DEBUG: log the responses for each category

      /* console.log('Response:', response.data);

      console.log('all', allResources);
      console.log('interest', interestResources);
      console.log('pregnant', pregnantResources);
      console.log('some', someResources);

      console.log('results', response.data.Result.Resources); */

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const renderRelatedItems = (relatedItems) => (
    <div className="related">
      <h4>Here are some related items:</h4>
      <ul>
        {relatedItems.map((relatedItem, index) => (
          <li key={index}>
            <a href={relatedItem.Url} target="_blank" rel="noopener noreferrer">{relatedItem.Title}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderResources = (resources, category) => (
    <div key={category}>
      <h2>{category}</h2>
      <ul>
        {resources.map((item, index) => (
          <li key={index}>
            <h3>Curious about {item.Categories}? Check out <i>{item.Title}</i>!</h3>
            <p>Follow the <a href={item.AccessibleVersion} target="_blank" rel="noopener noreferrer"> provided site</a> for more information!</p>
            {item.RelatedItems && renderRelatedItems(item.RelatedItems.RelatedItem)}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="FormContainer">
      <h1>US Department of Health and Human Services Health Literature Recommender</h1>
  
      {!token && (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p>New users:</p>
          <button onClick={handleRegister}>Register</button>
          <p>Returning users:</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Age (Years):
              <input type="text" value={user_age} onChange={(e) => setAge(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Sex (Male/Female):
              <input type="text" value={user_sex} onChange={(e) => setSex(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Pregnant (Yes/No):
              <input type="text" value={user_pregnant} onChange={(e) => setPregnant(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Tobacco Use (Yes/No):
              <input type="text" value={user_tobaccoUse} onChange={(e) => setTobaccoUse(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Sexually Active (Yes/No):
              <input type="text" value={user_sexuallyActive} onChange={(e) => setSexuallyActive(e.target.value)} />
            </label>
          </div>
          <button type="submit">Fetch Data</button>
        </form>
      )}

      {loading && <div>Loading...</div>}
      {/* ensure that age and sex are included */}
      {error_field && <div>Error: {error_field.message}</div>}

      <div className="Displayed">
        {formSubmitted && allResources.length !== 0 && renderResources(allResources, 'General Resources')}
        {formSubmitted && interestResources.length !== 0 && renderResources(interestResources, 'Additional Target Resources')}
        {pregnantResources.length !== 0 && renderResources(pregnantResources, 'Pregnancy Resources')}
        {formSubmitted && someResources.length !== 0 && renderResources(someResources, 'Quick Reads')}
      </div>
    </div>
  );
};

export default HealthData;

