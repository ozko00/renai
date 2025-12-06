
import plotly.graph_objects as go
import json

# Data for the 6 love styles
data = {
    "love_styles": [
        {
            "name": "Eros",
            "definition": "Passionate, physically-attracted love; intense emotional and sensual connection",
            "satisfaction": "High initial; tends to decrease over time as passion fades",
            "stability": "Moderate; can be stable if combined with Storge",
            "personality": "Openness, Extroversion; lower Neuroticism",
            "attachment": "Often Secure or Preoccupied; values physical intimacy",
            "optimal_partner": "Someone with mutual Eros or Storge; emotionally open; sexually compatible",
            "risks": "Jealousy if threatened; difficulty with long-term satisfaction"
        },
        {
            "name": "Ludus",
            "definition": "Playful, game-like love; treating relationships as entertainment; avoidance of commitment",
            "satisfaction": "Low long-term; high short-term novelty",
            "stability": "Very Low; frequent relationship changes; high breakup rates",
            "personality": "High Extroversion; low Agreeableness; low Conscientiousness",
            "attachment": "Often Avoidant or Fearful-Avoidant; fear of commitment",
            "optimal_partner": "Another Ludic person for casual arrangement; requires clear boundaries",
            "risks": "Promiscuity; serial dating; partner hurt; emotional distance"
        },
        {
            "name": "Storge",
            "definition": "Affectionate, friendship-based love; slow-developing companionship and mutual care",
            "satisfaction": "High long-term; stable and satisfying",
            "stability": "Very High; lowest divorce rates among styles",
            "personality": "High Agreeableness; moderate Conscientiousness",
            "attachment": "Often Secure; comfortable with interdependence",
            "optimal_partner": "Another Storge or Eros person; compatible life values; shared goals",
            "risks": "May lack passion or excitement; can become stagnant if not maintained"
        },
        {
            "name": "Pragma",
            "definition": "Practical, logical love; selection based on compatibility of traits, values, life goals",
            "satisfaction": "Moderate-High; pragmatic satisfaction",
            "stability": "High; rational commitment supports duration",
            "personality": "High Conscientiousness; practical-minded",
            "attachment": "Often Secure or Dismissive; values self-sufficiency",
            "optimal_partner": "Someone with aligned life goals, values, status, education; practical compatibility",
            "risks": "May lack emotional depth; perceived as cold; vulnerable to unmet emotional needs"
        },
        {
            "name": "Mania",
            "definition": "Obsessive, possessive love; intense jealousy, emotional dependency, fear of abandonment",
            "satisfaction": "Very Low; high conflict; emotional instability",
            "stability": "Very Low; chaotic relationships; high breakup rates",
            "personality": "High Neuroticism; low self-esteem; obsessive tendencies",
            "attachment": "Usually Preoccupied or Fearful-Avoidant; intense abandonment anxiety",
            "optimal_partner": "Ideally Secure attachment with patience; should avoid other Mania or Fearful partners",
            "risks": "Controlling behavior; emotional outbursts; potential for jealous aggression; requires intervention"
        },
        {
            "name": "Agape",
            "definition": "Selfless, unconditional, altruistic love; sacrifice and care for partner's well-being",
            "satisfaction": "High; fulfilling and meaningful",
            "stability": "High; commitment-oriented and forgiving",
            "personality": "High Agreeableness; high Openness; low Neuroticism",
            "attachment": "Often Secure; comfortable with vulnerability and interdependence",
            "optimal_partner": "Any style benefits from partner with Agape; but works best with Eros, Storge, or Pragma",
            "risks": "Self-sacrifice can lead to burnout; may enable unhealthy partner behavior if not boundaried"
        }
    ]
}

# Define brand colors
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C']

# Create table data
styles = [style['name'] for style in data['love_styles']]
definitions = [style['definition'] for style in data['love_styles']]
satisfactions = [style['satisfaction'] for style in data['love_styles']]
stabilities = [style['stability'] for style in data['love_styles']]
personalities = [style['personality'] for style in data['love_styles']]
attachments = [style['attachment'] for style in data['love_styles']]
partners = [style['optimal_partner'] for style in data['love_styles']]
risks = [style['risks'] for style in data['love_styles']]

# Create alternating row colors for better readability
row_colors = []
for i in range(len(styles)):
    row_colors.append(colors[i])

# Create the table
fig = go.Figure(data=[go.Table(
    columnwidth=[80, 250, 150, 120, 150, 150, 200, 180],
    header=dict(
        values=['<b>Style</b>', '<b>Definition</b>', '<b>Satisfaction</b>', 
                '<b>Stability</b>', '<b>Personality</b>', '<b>Attachment</b>', 
                '<b>Optimal Partner</b>', '<b>Risks</b>'],
        fill_color='#13343B',
        align='left',
        font=dict(color='white', size=13),
        height=40
    ),
    cells=dict(
        values=[styles, definitions, satisfactions, stabilities, 
                personalities, attachments, partners, risks],
        fill_color=[[f'rgba({int(c[1:3], 16)}, {int(c[3:5], 16)}, {int(c[5:7], 16)}, 0.15)' for c in row_colors]],
        align='left',
        font=dict(color='#13343B', size=11),
        height=70,
        line=dict(color='white', width=2)
    )
)])

fig.update_layout(
    title="Lee's 6 Love Styles Overview"
)

# Save as PNG and SVG
fig.write_image('love_styles.png')
fig.write_image('love_styles.svg', format='svg')
