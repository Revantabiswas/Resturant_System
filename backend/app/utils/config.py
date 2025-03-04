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

def initialize_knowledge_base(kb_path=None):
    """Initialize the knowledge base for the chatbot"""
    import pdfplumber
    
    # Path to the knowledge base documents
    if not kb_path:
        kb_path = os.getenv("KNOWLEDGE_BASE_PATH", "./restaurant_docs")
    
    # Create directory if it doesn't exist
    os.makedirs(kb_path, exist_ok=True)
    
    # Load documents from PDFs
    all_text = []
    pdf_files = [f for f in os.listdir(kb_path) if f.endswith('.pdf')]
    
    if not pdf_files:
        return None, "No PDF files found in the knowledge base directory."
    
    # Extract text from PDFs
    for pdf_file in pdf_files:
        try:
            with pdfplumber.open(os.path.join(kb_path, pdf_file)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        all_text.append(text)
        except Exception as e:
            print(f"Error processing {pdf_file}: {str(e)}")
    
    if not all_text:
        return None, "No text could be extracted from the PDF files."
    
    # Process text
    combined_text = "\n".join(all_text)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_text(combined_text)
    
    # Create vector store
    embeddings = get_embeddings()
    vector_store = FAISS.from_texts(final_documents, embeddings)
    
    # Save vector store for later use
    vector_store.save_local("faiss_index")
    
    return vector_store, "Knowledge base initialized successfully"