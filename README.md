# databases
Databases
=================================================================================================================


Network model

The network database model is a flexible way to organize data in a database, allowing for complex relationships between entities by representing them as nodes in a graph structure with edges representing relationships. Unlike hierarchical models, this model allows entities to have multiple parents or owners, fostering a more dynamic and interconnected representation of data. 

Flexibility:
The network model is designed to handle complex, many-to-many relationships between entities, unlike the hierarchical model's one-to-many restrictions. 
Graph Structure:
Data is represented as nodes in a graph, with edges connecting them to represent relationships, allowing for diverse and intricate connections. 
Records and Sets:
The model uses records to represent data and sets to define relationships between records. 
Ownership:
Instead of parent-child relationships, network models use the concept of owners and members to define relationships, where members can belong to multiple owners. 

-------------------------------------------------------------------------------------------------------------------------------


MapReduce

It's designed to handle large datasets that don't fit into the memory of a single machine. 
The core concept involves two functions: map and reduce, which are applied to data in parallel across a cluster of machines. 

Map Function:
Takes input data, splits it into key-value pairs, and applies a user-defined function to each pair. 
This function can perform tasks like filtering, sorting, or transforming the data. 
Reduce Function:
Takes the output from the map functions, which are grouped by their keys. 
It then applies a user-defined function to combine the values associated with the same key, producing a smaller, summarized output. 


Parallel Processing:
MapReduce enables the processing of data in parallel across a cluster of machines, significantly speeding up large-scale data processing tasks. 
Scalability:
It's designed to scale to handle massive datasets that are too large for a single machine. 
Fault Tolerance:
If a machine in the cluster fails, the MapReduce framework can continue processing the data on other machines, ensuring data loss is minimized. 
Simplicity:
It provides a high-level programming model that simplifies distributed programming, making it easier to develop applications for processing large datasets. 


-------------------------------------------------------------------------------------------------------------------------------

Cypher 

Cypher is a declarative graph query language developed by Neo4j for querying property graph databases. 
It's similar to SQL, but designed for graphs, allowing users to specify what data they want to retrieve rather than how to retrieve it. 
Cypher uses ASCII-art notation to visually represent graph patterns, making it intuitive and easy to learn

Declarative:
Users specify the data they want (what), and the database engine handles the details of how to retrieve it. 
Graph-focused:
Cypher is tailored for the structure of graph databases, with nodes and relationships as fundamental entities. 
Intuitive:
The use of ASCII-art notation (e.g., (nodes)-[:RELATIONSHIP]->(otherNodes)) makes Cypher easy to read and write, says Neo4j. 
Powerful and expressive:
Cypher allows for complex queries that can reveal hidden data connections and relationships within the graph. 
OpenCypher:
Cypher is the basis for the openCypher project, which is developing a standard for graph query languages. 


Examples

(X)-[:IS_A]->(Y): 
Represents a relationship between node X and Y, where the relationship is labeled "IS_A".

MATCH (n:Person) WHERE n.name = 'Alice' RETURN n: 
Finds all nodes labeled "Person" with the property "name" equal to "Alice" and returns the node.

CREATE (a:Person {name:"Bob"})<-[:LOVES]-(b:Person {name:"Charlie"}): 
Creates a node named "Bob" labeled "Person", a node named "Charlie" labeled "Person", and a relationship between them labeled "LOVES". 

-------------------------------------------------------------------------------------------------------------------------------


Property Graphs

A property graph database is a type of graph database that uses nodes, edges, and properties to represent data and relationships. Nodes represent entities, edges represent relationships between entities, and properties store additional information about nodes and edges. 

Nodes: Represent individual entities or objects in the database. 
Edges: Represent relationships or connections between nodes. 
Properties: Store attributes or data associated with nodes and edges, using key-value pairs. 
Querying: Graph databases excel at navigating and querying complex relationships between data, making them well-suited for applications like social networks, recommendation systems, and fraud detection. 
Flexibility: Graph databases are flexible, allowing users to add new data and relationships without needing to redesign the entire database. 


-------------------------------------------------------------------------------------------------------------------------------

Triple stores

A triple store is a specialized database designed to store and manage data in the form of triples. 
Each triple consists of a subject, a predicate (defining the relationship), and an object, representing a fact or statement. 

Triple Structure:
The core data unit in a triple store is the triple, which represents a relationship between two entities (subject and object) using a predicate. 
Graph Data Model:
Triple stores use a graph-based model, where entities and relationships are interconnected, unlike relational databases with tables and schemas. 
RDF Support:
They are designed to work with the Resource Description Framework (RDF), a W3C standard for data interchange on the web. 
SPARQL Querying:
Triple stores are typically queried using SPARQL, a query language optimized for graph traversal. 
Inference:
Some triple stores support inference, allowing them to deduce new facts based on existing triples and ontologies, expanding the knowledge base. 
Semantic Web:
They are a key component of the Semantic Web, a vision for a web where data is represented in a machine-readable format with meaning. 

Examples of Triplestore Systems:
Blazegraph: An open-source triplestore designed for large-scale data storage and querying.
Apache Jena: A widely used Java-based triplestore and framework.
GraphDB: A commercial triplestore with enterprise features.
RDFLib: A Python-based library for working with RDF data.
Vistorso: An open-source triplestore engine with strong performance. 

-------------------------------------------------------------------------------------------------------------------------------

RDF Data model

The Resource Description Framework (RDF) is a graph data model used for representing information and its meaning on the web. It uses a simple, yet powerful, triples structure (subject-predicate-object) to describe relationships between resources, like documents, people, or abstract concepts. RDF facilitates data merging and schema evolution, making it suitable for various applications, including the Semantic Web. 

Triple structure:
Each RDF statement is a triple, consisting of a subject, a predicate (the relationship), and an object. 
Resource identification:
RDF uses Internationalized Resource Identifiers (IRIs) to uniquely identify resources, which can be URIs or other unique identifiers. 
Graph representation:
RDF data is represented as a graph, where nodes are resources and edges represent relationships (triples) between them. 
Metadata representation:
RDF is used to describe and exchange metadata, which is data about data, allowing for a standardized way to exchange data based on relationships. 
Semantic Web foundation:
RDF is a core technology for the Semantic Web, enabling machine-readable data with well-defined semantics. 
Data interoperability:
RDF promotes data interoperability by providing a standard way to represent and exchange data, even from different sources or applications. 


-------------------------------------------------------------------------------------------------------------------------------

SPARQL Query


A SPARQL query is used to retrieve, insert, delete, and generally manipulate data stored in RDF (Resource Description Framework) format, 
which is a standard for representing data in a way that can be understood by machines. 
It's like SQL for relational databases, but for the graph-based world of linked data. 
SPARQL queries are built using triple patterns (subject-predicate-object), which are fundamental to RDF. 


Querying RDF Data:
SPARQL is specifically designed to query data stored in the RDF format, which is commonly used in semantic web technologies. 
Graph-Based:
SPARQL works with RDF graphs, where data is represented as nodes (resources) and edges (relationships). 
Triple Patterns:
Queries are constructed using triple patterns, which match subject-predicate-object relationships within the graph. 
Diverse Data Sources:
SPARQL can be used to query data from various sources, whether it's stored natively in RDF or can be mapped to RDF using middleware. 
SELECT, CONSTRUCT, ASK, DESCRIBE:
SPARQL supports different types of queries, including SELECT (returning data as a table), CONSTRUCT (creating a new RDF graph),
ASK (checking for the existence of a pattern), and DESCRIBE (returning data about a resource). 
INSERT, DELETE:
SPARQL also provides commands for adding and removing data from RDF graphs. 
W3C Standard:
SPARQL is a standardized query language developed by the W3C RDF Data Access Working Group. 


-------------------------------------------------------------------------------------------------------------------------------
