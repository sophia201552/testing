import React from 'react';

import css from './NoStrategyPromptPanel.css';

class NoStrategyPromptPanel extends React.PureComponent {
    constructor(props) {
        super(props); 
    }

    render() {
        var {items, i18n} = this.props;
        if(items && items.length){
            return false;
        }
        return (
            <div className={css['main']}>
                <div className={css['content']}>
                    <div className={css['prompt1']}>{i18n.prompt1}</div>
                    <div className={css['prompt2']}>{i18n.prompt2}</div>
                </div>
            </div>
        )
    }
}

export default NoStrategyPromptPanel;
