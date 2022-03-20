import React, { useEffect, useState } from 'react';
import './CurrencyExchange';

const Expire = (props) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, props.delay);
  }, [props.delay]);

  return visible ? (
    <div className='exchangeMessage'>{props.children}</div>
  ) : (
    <div />
  );
};

export default Expire;
