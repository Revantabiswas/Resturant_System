import os
from dotenv import load_dotenv
from langchain.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings

def load_environment():
    """Load environment variables from .env file"""
    load_dotenv()

def get_max_capacity():
    """Get the maximum capacity from environment variables or use default"""
    return int(os.getenv("MAX_CAPACITY", 50))

def get_embeddings():
    """Get HuggingFace embeddings model"""
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        cache_folder=None  # Set to a specific path if you want to cache the model
    )

def initialize_knowledge_base():
    """Initialize the knowledge base for the chatbot"""
    # Path to the knowledge base documents
    kb_path = os.getenv("KNOWLEDGE_BASE_PATH", "./data/knowledge_base")
    
    # Load documents
    loader = DirectoryLoader(kb_path, glob="*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    texts = text_splitter.split_documents(documents)
    
    # Create embeddings and vector store
    embeddings = get_embeddings()
    vector_store = FAISS.from_documents(texts, embeddings)
    
    # Save vector store for later use
    vector_store.save_local("faiss_index")
    
    return vector_store