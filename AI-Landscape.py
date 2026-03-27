from datetime import date
from pathlib import Path

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.analytics import KinesisDataStreams
from diagrams.aws.compute import (
    ElasticContainerService as ECS,
    ElasticKubernetesService as EKS,
    Lambda,
)
from diagrams.aws.database import Dynamodb, RDS, Redshift
from diagrams.aws.devtools import Codebuild, Codepipeline
from diagrams.aws.integration import (
    Eventbridge,
    SimpleNotificationServiceSns as SNS,
    SimpleQueueServiceSqs as SQS,
    StepFunctions,
)
from diagrams.aws.management import Cloudtrail, Cloudwatch, Config
from diagrams.aws.ml import (
    Bedrock as BedrockNode,
    Kendra,
    Sagemaker,
    SagemakerModel,
    SagemakerTrainingJob,
)
from diagrams.aws.network import APIGateway, VPC
from diagrams.aws.security import IdentityAndAccessManagementIam as IAM, KMS, WAF
from diagrams.aws.storage import S3
from diagrams.custom import Custom
from diagrams.onprem.client import Client
from diagrams.onprem.queue import Kafka

today = date.today().isoformat()

GRAPH_ATTR = {
    "fontsize": "11",
    "splines": "spline",
    "nodesep": "0.5",
    "ranksep": "1.1",
    "bgcolor": "white",
    "pad": "0.8",
    "dpi": "150",
}

NODE_ATTR = {
    "fontsize": "9",
    "width": "1.4",
    "height": "1.4",
}

I = str(Path(__file__).parent.absolute() / "images") + "/"

IC_ANT = I + "anthropic.png"
IC_OAI = I + "openai.png"
IC_GGL = I + "google.png"
IC_GCP = I + "googlecloud.png"
IC_META = I + "meta.png"
IC_MS  = I + "microsoft.png"
IC_XAI = I + "xai.png"
IC_MIS = I + "mistral.png"
IC_DS  = I + "deepseek.png"
IC_COH = I + "cohere.png"
IC_AWS = I + "aws.png"
IC_AZR = I + "azure.png"
IC_HF  = I + "huggingface.png"
IC_LC  = I + "langchain.png"
IC_OLL = I + "ollama.png"
IC_GRQ = I + "groq.png"
IC_PCN = I + "pinecone.png"
IC_QDR = I + "qdrant.png"
IC_WEA = I + "weaviate.png"
IC_WNB = I + "wandb.png"
IC_MLF = I + "mlflow.png"
IC_N8N = I + "n8n.png"
IC_GH  = I + "github.png"
IC_GHA = I + "githubactions.png"
IC_TF  = I + "terraform.png"
IC_KFK = I + "kafka.png"
IC_NOT = I + "notion.png"
IC_NVD = I + "nvidia.png"
IC_SLK = I + "slack.png"
IC_CRW = I + "crewai.png"
IC_DFY = I + "dify.png"
IC_FLW = I + "flowise.png"
IC_TGT = I + "together.png"
IC_VLM = I + "vllm.png"
IC_LLI = I + "llamaindex.png"
IC_LNF = I + "langfuse.png"
IC_ARZ = I + "arize.png"
IC_E11 = I + "elevenlabs.png"
IC_RWY = I + "runway.png"
IC_E2B = I + "e2b.png"
IC_OSS = I + "opensearch.png"
IC_M0  = I + "mem0.png"
IC_LAK = I + "lakera.png"
IC_FLX = I + "flux.png"
IC_MCP = I + "anthropic.png"
IC_GEN = I + "generic.png"
IC_PG  = I + "postgresql.png"
IC_MLV = I + "milvus.png"

with Diagram(
    f"AI Builder Landscape  ·  {today}",
    filename=f"Final/ai_landscape_{today.replace('-', '')}",
    show=False,
    direction="TB",
    graph_attr=GRAPH_ATTR,
    node_attr=NODE_ATTR,
):

    with Cluster("Human Interfaces"):
        web_app   = Client("Web & Mobile")
        chat_ui   = Client("Chat & Voice\n(Connect / IVR)")
        ide_tools = Client("IDE Copilots\n(Cursor, Copilot, Cline)")
        ent_tools = Client("Enterprise\n(Slack, Teams, Notion)")
        api_users = Client("APIs & Webhooks")

    with Cluster("Application Platform"):
        api_gw    = APIGateway("API Gateway")
        lambdas   = Lambda("Lambda")
        ecs_svc   = ECS("ECS")
        eks_svc   = EKS("EKS / K8s")
        step_fn   = StepFunctions("Step Functions")
        evtbridge = Eventbridge("EventBridge")
        sqs_q     = SQS("SQS")
        sns_t     = SNS("SNS")

    with Cluster("Agent Orchestration Frameworks"):
        with Cluster("AWS-native"):
            strands    = Custom("Strands\n(AWS SDK)", IC_AWS)
            bedrock_ag = BedrockNode("Bedrock Agents\n& AgentCore")

        with Cluster("Open / Cross-cloud"):
            langgraph = Custom("LangGraph /\nLangChain", IC_LC)
            crewai    = Custom("CrewAI", IC_CRW)
            autogen   = Custom("AutoGen\n(Microsoft)", IC_MS)
            sem_kern  = Custom("Semantic Kernel\n(Microsoft)", IC_MS)
            dify      = Custom("Dify", IC_DFY)
            flowise   = Custom("Flowise / n8n", IC_FLW)

    with Cluster("Tool & Protocol Layer"):
        mcp          = Custom("MCP\n(Model Context Protocol)", IC_MCP)
        fn_calling   = Custom("Function Calling /\nTool Use", IC_GEN)
        code_interp  = Custom("Code Execution\n(E2B, Sandbox)", IC_E2B)
        web_browse   = Custom("Web Search &\nBrowsing", IC_GEN)
        computer_use = Custom("Computer Use\n(Browser, Desktop)", IC_ANT)

    with Cluster("Foundation Models"):
        with Cluster("Anthropic"):
            claude35 = Custom("Claude 3.5 / 3.7\nSonnet · Haiku", IC_ANT)
            claude4  = Custom("Claude 4 / 4.5\nOpus · Sonnet", IC_ANT)

        with Cluster("OpenAI"):
            gpt4o  = Custom("GPT-4o / 4.5", IC_OAI)
            o3_mdl = Custom("o3 / o3-mini\n(reasoning)", IC_OAI)

        with Cluster("Google DeepMind"):
            gemini20 = Custom("Gemini 2.0\nFlash · Pro", IC_GGL)
            gemini25 = Custom("Gemini 2.5 Pro\n(reasoning)", IC_GGL)
            gemma3   = Custom("Gemma 3\n(open-weight)", IC_GGL)

        with Cluster("Meta"):
            llama4  = Custom("Llama 4\n(open-weight)", IC_META)
            llama33 = Custom("Llama 3.3 /\nCode Llama", IC_META)

        with Cluster("Other Frontier"):
            grok3    = Custom("xAI Grok 3", IC_XAI)
            mistral  = Custom("Mistral Large /\nMixtral", IC_MIS)
            deepseek = Custom("DeepSeek V3 /\nR2 (reasoning)", IC_DS)
            cohere   = Custom("Cohere\nCommand R+", IC_COH)
            nova     = Custom("Amazon Nova\nMicro · Lite · Pro", IC_AWS)

        with Cluster("Specialized / Multimodal"):
            img_fms  = Custom("Image: Flux /\nDALL-E 3 / SD3", IC_FLX)
            aud_fms  = Custom("Audio: Whisper /\nElevenLabs / Suno", IC_E11)
            vid_fms  = Custom("Video: Sora /\nRunway / Kling", IC_RWY)
            code_fms = Custom("Code: Codestral /\nDeepSeek Coder", IC_DS)

    with Cluster("Model Infrastructure"):
        with Cluster("Managed APIs"):
            bedrock_fm = BedrockNode("Amazon Bedrock\n(40+ FMs)")
            az_oai     = Custom("Azure OpenAI\nService", IC_AZR)
            vertex_ai  = Custom("Google\nVertex AI", IC_GCP)
            ai_apis    = Custom("Together / Groq /\nFireworks AI", IC_GRQ)

        with Cluster("MLOps Platform"):
            sm_train = SagemakerTrainingJob("SageMaker\nTraining & Tuning")
            sm_inf   = Sagemaker("SageMaker\nInference")
            sm_ops   = SagemakerModel("SageMaker Pipelines\nMonitor · Clarify")

        with Cluster("Self-hosted / Open"):
            hf_hub   = Custom("HuggingFace Hub\n(300k+ models)", IC_HF)
            ollama   = Custom("Ollama\n(local inference)", IC_OLL)
            vllm_svc = Custom("vLLM / TGI\n(high-throughput)", IC_VLM)
            lm_st    = Custom("LM Studio / Jan\n(desktop)", IC_OLL)

    with Cluster("Memory & Knowledge"):
        with Cluster("RAG & Retrieval"):
            bedrock_kb = BedrockNode("Bedrock\nKnowledge Bases")
            llama_idx  = Custom("LlamaIndex /\nHaystack", IC_LLI)
            graphrag   = Custom("GraphRAG /\nKnowledge Graph", IC_MS)

        with Cluster("Vector Stores"):
            vec_db1 = Custom("Pinecone /\nWeaviate", IC_PCN)
            vec_db2 = Custom("Chroma / Qdrant /\nMilvus", IC_QDR)
            vec_db3 = Custom("pgvector /\nOpenSearch", IC_OSS)

        with Cluster("Agent Memory"):
            short_mem = Custom("Context Window\n(short-term)", IC_GEN)
            long_mem  = Custom("Mem0 / MemGPT\n(long-term)", IC_M0)

    with Cluster("Data Sources"):
        with Cluster("Operational"):
            rds_db      = RDS("RDS / Aurora")
            ddb_db      = Dynamodb("DynamoDB")
            redshift_dw = Redshift("Redshift")

        with Cluster("Object & Document"):
            s3_lake   = S3("S3 Data Lake")
            doc_store = Custom("Confluence /\nSharePoint /\nNotion", IC_NOT)
            kendra    = Kendra("Amazon Kendra")

        with Cluster("Streams"):
            kinesis_s = KinesisDataStreams("Kinesis")
            kafka_s   = Kafka("MSK / Kafka")

    with Cluster("LLMOps & AI Quality"):
        with Cluster("Tracing & Observability"):
            langsmith = Custom("LangSmith\n(LangChain)", IC_LC)
            langfuse  = Custom("Langfuse\n(open-source)", IC_LNF)
            phoenix   = Custom("Phoenix /\nArize", IC_ARZ)
            cw_llm    = Cloudwatch("CloudWatch\nMetrics · Logs")

        with Cluster("Evaluation"):
            bk_eval  = BedrockNode("Bedrock\nEvaluations")
            ragas    = Custom("RAGAS /\nDeepEval", IC_GEN)
            wb_weave = Custom("W&B Weave /\nMLflow", IC_WNB)

        with Cluster("Guardrails & Safety"):
            bk_guard  = BedrockNode("Bedrock\nGuardrails")
            nemo_g    = Custom("NeMo Guardrails /\nLakera Guard", IC_NVD)
            ai_safety = Custom("Constitutional AI /\nRLHF · DPO", IC_ANT)

    with Cluster("Security & Governance"):
        iam_n   = IAM("IAM / RBAC")
        kms_n   = KMS("KMS")
        vpc_n   = VPC("VPC / PrivateLink")
        waf_n   = WAF("WAF")
        trail_n = Cloudtrail("CloudTrail")
        cfg_n   = Config("Config")

    with Cluster("DevOps & Platform Engineering"):
        codepipe   = Codepipeline("CodePipeline")
        codebld    = Codebuild("CodeBuild")
        tf_cdk     = Custom("Terraform /\nCDK / CFN", IC_TF)
        github_act = Custom("GitHub Actions /\nGitLab CI", IC_GHA)

    for iface in [web_app, chat_ui, ide_tools, ent_tools, api_users]:
        iface >> api_gw
    api_gw >> [lambdas, ecs_svc, eks_svc]

    for src in [lambdas, ecs_svc]:
        src >> Edge(label="invoke") >> [strands, langgraph, crewai]
    step_fn >> Edge(label="orchestrate") >> [strands, bedrock_ag, autogen]
    evtbridge >> [strands, langgraph]

    for orch in [strands, langgraph, crewai, autogen]:
        orch >> mcp
    mcp >> [fn_calling, code_interp, web_browse, computer_use]

    for orch in [strands, langgraph, crewai, autogen, sem_kern]:
        orch >> Edge(label="LLM API") >> bedrock_fm
    for orch in [langgraph, crewai, autogen]:
        orch >> Edge(label="LLM API") >> [az_oai, vertex_ai, ai_apis]
    for orch in [dify, flowise]:
        orch >> Edge(label="LLM API") >> [bedrock_fm, ai_apis]

    bedrock_fm >> [claude35, claude4, gpt4o, nova]
    az_oai     >> [gpt4o, o3_mdl]
    vertex_ai  >> [gemini20, gemini25, gemma3]
    hf_hub     >> [llama4, llama33, mistral, deepseek]
    ollama     >> [llama4, gemma3]
    vllm_svc   >> [llama4, mistral, deepseek]

    for src in [s3_lake, rds_db, ddb_db]:
        src >> sm_train
    sm_train >> sm_inf
    sm_inf >> [strands, langgraph]
    sm_train >> sm_ops
    sm_inf >> sm_ops

    for orch in [strands, langgraph, bedrock_ag]:
        orch >> Edge(label="retrieve") >> bedrock_kb
    for orch in [langgraph, crewai, autogen]:
        orch >> Edge(label="retrieve") >> llama_idx
    bedrock_kb >> [vec_db1, vec_db3]
    llama_idx  >> [vec_db2, vec_db3]
    kendra >> bedrock_kb
    for src in [s3_lake, doc_store]:
        src >> bedrock_kb
    for src in [rds_db, ddb_db]:
        src >> llama_idx

    for src in [kinesis_s, kafka_s]:
        src >> s3_lake

    for orch in [strands, langgraph, crewai]:
        orch >> Edge(label="trace") >> [langsmith, langfuse, cw_llm]
    for src in [bedrock_fm, bedrock_ag]:
        src >> [bk_eval, bk_guard]
    for src in [sm_inf, sm_ops]:
        src >> wb_weave
    for src in [autogen, sem_kern]:
        src >> ragas

    for src in [lambdas, ecs_svc, eks_svc, bedrock_fm, sm_inf]:
        src >> iam_n
    for src in [bedrock_fm, sm_inf, s3_lake, ddb_db]:
        src >> kms_n
    for src in [lambdas, ecs_svc, bedrock_fm]:
        src >> vpc_n
    api_gw >> waf_n
    for src in [lambdas, ecs_svc, bedrock_ag, sm_inf]:
        src >> trail_n

    for src in [codepipe, codebld, github_act]:
        src >> Edge(label="deploy") >> [lambdas, ecs_svc, eks_svc]
    tf_cdk >> [lambdas, sm_inf, bedrock_ag, bedrock_fm]
