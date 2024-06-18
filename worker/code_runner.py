import os, sys

# compiler start
def compile(file, lang):
    if(os.path.isfile(file) == False):
      return 404
    
    if lang == 'python' or lang =='python3' or lang == 'py' :
      return 200
    elif lang =='c':
      os.system('gcc '+file)
    elif lang =='c++':
      os.system('g++ '+file)
    elif lang=='java':
        os.system('javac '+file)  

    if(os.path.isfile('a.out')) or (os.path.isfile('main.class')):
        return 200
    else:
        return 400 
# compiler end

# executer - JAVA bytecode executer, .exe executer in case of c/cpp

# executer start
def executer(file, input, output, lang, timeout):
  # cmd = 'sudo -u judge '
  cmd = 'sudo -u judge '
  if lang =='java':
    cmd += 'java main'
  elif lang =='c' or lang =='cpp' or lang =='c++':
    cmd+='./a.out'
  elif lang =='python' or lang =='python3' or lang == 'py':
    cmd+='python3 '+file

  command = f"timeout {timeout} {cmd} < {input} > {output}"

  r = os.system(command)

  if r == 0:
    return 200
  
  elif r == 31744:
    return 408
  else:
     return 400
# executer end


params = sys.argv

code_src_file = params[1]
input_file = params[2]
output_file = params[3]
folder = params[4]
lang = params[5]
timeout = str(min(15, max(1, int(float(params[6])))))

os.chdir(folder)

status = compile(code_src_file, lang)

if status == 200:
  status = executer(code_src_file, input_file, output_file, lang, timeout)

codes = {200:'success',404:'file not found',400:'error',408:'timeout'}
print(codes[status])