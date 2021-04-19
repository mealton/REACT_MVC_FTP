const Content = props => publication.id ?
    <Publication publication={props.data[publication.id]}/> :
    <div className="grid articles"><Publications publications={Object.values(props.data).reverse()}/></div>;